import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser, updateUser, deleteUser } from '../services/users'
import type { User, UserAddress, UserStatus } from './useUsers'
import type { UserFormValues } from '../schemas/userFormSchema'

/**
 * Hooks de mutations de usuário (criar, atualizar, excluir) integrados ao React Query.
 *
 * Responsabilidades principais:
 * - Fornecer mutations com **atualização otimista** da lista global de usuários e do cache de detalhe,
 *   garantindo que a listagem reflita imediatamente as alterações feitas via formulário.
 * - Manter o cache consistente mesmo usando uma **API mock** (JSONPlaceholder),
 *   que não persiste de fato os dados, tratando a lista como fonte de verdade local.
 * - Expor callbacks de sucesso/erro para que a UI mostre mensagens (ex.: `Snackbar`) e navegue após salvar.
 * - Encapsular a invalidation manual, remoção de cache e rollback em caso de falha.
 */

export const USERS_QUERY_KEY = ['users'] as const

type UpdateUserVariables = { id: number; values: UserFormValues }

type MutationContext = {
  previousUsers: User[] | undefined
  optimisticId?: number
}

// Normaliza o endereço vindo do formulário para o formato usado internamente,
// evitando salvar objetos vazios quando todos os campos estão em branco.
const normalizeAddress = (address: UserFormValues['address']): UserAddress | undefined => {
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

// Constrói um objeto `User` completo a partir dos valores do formulário.
const toUser = (id: number, values: UserFormValues): User => ({
  id,
  name: values.name,
  username: values.username,
  email: values.email,
  status: (values.status ?? 'active') as UserStatus,
  address: normalizeAddress(values.address),
  phone: values.phone,
  website: values.website,
})

export const useCreateUser = (options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY })
      const previousUsers = queryClient.getQueryData<User[]>(USERS_QUERY_KEY)
      const optimisticId = -Date.now()
      const optimisticUser = toUser(optimisticId, values)

      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old = []) => [
        ...old,
        optimisticUser,
      ])

      // mantém também o cache do detalhe, caso já exista tela de edição aberta futuramente
      queryClient.setQueryData<User | null>([...USERS_QUERY_KEY, optimisticId], optimisticUser)

      return { previousUsers, optimisticId } satisfies MutationContext
    },
    onSuccess: (createdUser, _variables, context) => {
      // Substitui o usuário otimista pelo retornado da API,
      // mantendo a lista local sem depender da persistência do JSONPlaceholder.
      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old = []) => {
        if (old.length === 0) return [createdUser]

        const optimisticId = context?.optimisticId
        let updated = old

        if (optimisticId != null) {
          updated = updated.map((u) => (u.id === optimisticId ? createdUser : u))
        }

        const alreadyExists = updated.some((u) => u.id === createdUser.id)
        if (!alreadyExists) {
          updated = [...updated, createdUser]
        }

        return updated
      })

      // mantém o cache do detalhe sincronizado
      queryClient.setQueryData<User | null>([...USERS_QUERY_KEY, createdUser.id], createdUser)

      options?.onSuccess?.()
    },
    onError: (error, _variables, context) => {
      if (context?.previousUsers != null) {
        queryClient.setQueryData(USERS_QUERY_KEY, context.previousUsers)
      }
      options?.onError?.(error)
    },
  })
}

export const useUpdateUser = (options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values }: UpdateUserVariables) => updateUser(id, values),
    onMutate: async ({ id, values }) => {
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY })
      const previousUsers = queryClient.getQueryData<User[]>(USERS_QUERY_KEY)
      const optimisticUser = toUser(id, values)

      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old = []) =>
        old.map((u) => (u.id === id ? optimisticUser : u)),
      )

      queryClient.setQueryData<User | null>([...USERS_QUERY_KEY, id], optimisticUser)

      return { previousUsers } satisfies MutationContext
    },
    onSuccess: (updatedUser) => {
      // Atualiza lista e detalhe sem refetch da API (que não persiste alterações)
      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old = []) =>
        old.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      )

      queryClient.setQueryData<User | null>([...USERS_QUERY_KEY, updatedUser.id], updatedUser)

      options?.onSuccess?.()
    },
    onError: (error, _variables, context) => {
      if (context?.previousUsers != null) {
        queryClient.setQueryData(USERS_QUERY_KEY, context.previousUsers)
      }
      options?.onError?.(error)
    },
  })
}

export const useDeleteUser = (options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY })
      const previousUsers = queryClient.getQueryData<User[]>(USERS_QUERY_KEY)

      // Remove otimista da lista
      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old = []) =>
        old.filter((u) => u.id !== id),
      )

      // Limpa também o cache de detalhe do usuário
      queryClient.removeQueries({ queryKey: [...USERS_QUERY_KEY, id] })

      return { previousUsers } satisfies MutationContext
    },
    onSuccess: () => {
      options?.onSuccess?.()
    },
    onError: (error, _variables, context) => {
      if (context?.previousUsers != null) {
        queryClient.setQueryData(USERS_QUERY_KEY, context.previousUsers)
      }
      options?.onError?.(error)
    },
  })
}
