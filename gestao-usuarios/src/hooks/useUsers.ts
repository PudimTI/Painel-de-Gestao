import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

/**
 * Tipos e hooks de leitura relacionados a usuários.
 *
 * Responsabilidades principais:
 * - Centralizar o contrato do modelo de **Usuário** utilizado em toda a aplicação.
 * - Integrar com a **API mock** baseada em `jsonplaceholder.typicode.com`, fazendo GET em `/users` e `/users/:id`.
 * - Encapsular o uso do **React Query** para listar (`useUsers`) e buscar um usuário específico (`useUser`),
 *   com chave de cache única e controle de `staleTime`/`enabled`.
 */

export type UserStatus = 'active' | 'inactive'

export type UserAddressGeo = {
  lat: string
  lng: string
}

export type UserAddress = {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: UserAddressGeo
}

export type User = {
  id: number
  name: string
  username: string
  email: string
  status: UserStatus
  address?: UserAddress
  phone?: string
  website?: string
}

const USERS_QUERY_KEY = ['users'] as const

type ApiUser = Omit<User, 'status'>

// Busca a lista de usuários na API mock e adiciona um status derivado a partir do `id`.
// Como o JSONPlaceholder não possui campo de status, simulamos: ids pares = "active", ímpares = "inactive".
const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get<ApiUser[]>('/users')

  return response.data.map((user) => ({
    ...user,
    // Simulação de status estável: pares = ativo, ímpares = inativo
    status: user.id % 2 === 0 ? 'active' : 'inactive',
  }))
}

// Busca um único usuário por id, aplicando a mesma regra de status derivado usada na listagem.
const fetchUser = async (id: number): Promise<User> => {
  const response = await api.get<ApiUser>(`/users/${id}`)
  const user = response.data
  return {
    ...user,
    status: user.id % 2 === 0 ? 'active' : 'inactive',
  }
}

// Hook de listagem: devolve a lista de usuários e estados de carregamento/erro,
// já integrados ao cache do React Query pela chave `USERS_QUERY_KEY`.
export const useUsers = () => {
  const query = useQuery<User[]>({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
    staleTime: 1000 * 60, // 1 minuto
  })

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

// Hook de detalhe: busca um único usuário apenas quando `id` é válido,
// permitindo reutilizar a mesma lógica de cache para edição.
export const useUser = (id: number | null) => {
  return useQuery<User | null>({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: () => (id != null ? fetchUser(id) : Promise.resolve(null)),
    enabled: id != null,
    staleTime: 1000 * 60,
  })
}


