import { api } from './api'
import type { User, UserAddress, UserStatus } from '../hooks/useUsers'
import type { UserFormValues } from '../schemas/userFormSchema'

/**
 * Serviço de integração com a API de usuários.
 *
 * Responsabilidades principais:
 * - Traduzir o formato do formulário (`UserFormValues`) para o **payload aceito pela API mock**
 *   (`jsonplaceholder.typicode.com/users` ou um `json-server` equivalente).
 * - Normalizar a resposta da API para o tipo de domínio `User`, garantindo que o restante da aplicação
 *   não precise conhecer detalhes de transporte.
 * - Implementar as operações de **criação**, **atualização** e **exclusão** que são consumidas pelos hooks
 *   de mutation (`useUserMutations`).
 */

// Payload enviado/recebido pela API (segue formato mais permissivo do formulário)
type ApiUserAddressPayload = {
  street?: string
  suite?: string
  city?: string
  zipcode?: string
  geo?: {
    lat?: string
    lng?: string
  }
}

type ApiUserPayload = {
  name: string
  username: string
  email: string
  address?: ApiUserAddressPayload
  phone?: string
  website?: string
}

type ApiUserResponse = ApiUserPayload & {
  id: number
}

const toApiPayload = (values: UserFormValues): ApiUserPayload => ({
  name: values.name,
  username: values.username,
  email: values.email,
  address: values.address,
  phone: values.phone,
  website: values.website,
})

const normalizeAddressFromApi = (
  address: ApiUserAddressPayload | undefined,
): UserAddress | undefined => {
  if (!address) return undefined

  const hasAnyField =
    !!address.street ||
    !!address.suite ||
    !!address.city ||
    !!address.zipcode ||
    !!address.geo?.lat ||
    !!address.geo?.lng

  if (!hasAnyField) return undefined

  return {
    street: address.street ?? '',
    suite: address.suite ?? '',
    city: address.city ?? '',
    zipcode: address.zipcode ?? '',
    geo: {
      lat: address.geo?.lat ?? '',
      lng: address.geo?.lng ?? '',
    },
  }
}

/** POST /users - Cria um novo usuário */
export const createUser = async (values: UserFormValues): Promise<User> => {
  const response = await api.post<ApiUserResponse>('/users', toApiPayload(values))
  const { id, name, username, email, address, phone, website } = response.data
  const status: UserStatus = values.status ?? 'active'

  return {
    id,
    name,
    username,
    email,
    status,
    address: normalizeAddressFromApi(address),
    phone,
    website,
  }
}

/** PUT /users/:id - Atualiza um usuário existente (substituição completa) */
export const updateUser = async (
  id: number,
  values: UserFormValues,
): Promise<User> => {
  const response = await api.put<ApiUserResponse>(`/users/${id}`, toApiPayload(values))
  const { name, username, email, address, phone, website } = response.data
  const status: UserStatus = values.status ?? 'active'

  return {
    id,
    name,
    username,
    email,
    status,
    address: normalizeAddressFromApi(address),
    phone,
    website,
  }
}

/** DELETE /users/:id - Remove um usuário (simulado, mantemos cache local) */
export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`)
}
