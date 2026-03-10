import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { UserForm } from '../components/UserForm'
import { useSnackbar } from '../contexts/SnackbarContext'
import { useUser } from '../hooks/useUsers'
import { useCreateUser, useUpdateUser } from '../hooks/useUserMutations'
import type { UserFormValues } from '../schemas/userFormSchema'
import { getErrorMessage } from '../utils/errorMessage'

/**
 * Página que orquestra o fluxo de **Cadastro e Edição**.
 *
 * Responsabilidades principais:
 * - Decidir se a tela está em modo **criação** ou **edição** a partir do `id` na URL (`/users/new` ou `/users/:id/edit`).
 * - Carregar os dados do usuário individual com `useUser` (React Query) quando em modo edição.
 * - Disparar as mutations de **criação** (`useCreateUser`) ou **atualização** (`useUpdateUser`),
 *   garantindo que o cache global de usuários seja atualizado e que a listagem reflita as mudanças.
 * - Exibir feedback ao usuário via `Snackbar` em caso de sucesso/erro e navegar de volta para a tela de listagem.
 */

const UserFormPage = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useSnackbar()
  const { id } = useParams<{ id: string }>()
  const parsedId = id != null ? parseInt(id, 10) : NaN
  const isEditMode = !Number.isNaN(parsedId)
  const userId = isEditMode ? parsedId : null

  const { data: user, isLoading: isLoadingUser, isError: isUserError } = useUser(userId)
  const createMutation = useCreateUser({
    onSuccess: () => {
      showSuccess('Usuário cadastrado com sucesso!')
      navigate('/')
    },
    onError: (err) => {
      showError(getErrorMessage(err, 'Erro ao cadastrar usuário.'))
    },
  })
  const updateMutation = useUpdateUser({
    onSuccess: () => {
      showSuccess('Usuário atualizado com sucesso!')
      navigate('/')
    },
    onError: (err) => {
      showError(getErrorMessage(err, 'Erro ao atualizar usuário.'))
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (values: UserFormValues) => {
    if (isEditMode && userId != null && !Number.isNaN(userId)) {
      await updateMutation.mutateAsync({ id: userId, values })
    } else {
      await createMutation.mutateAsync(values)
    }
  }

  const handleCancel = () => navigate('/')

  if (isEditMode && (isLoadingUser || (userId != null && !user && !isUserError))) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isEditMode && (isUserError || (userId != null && !user))) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Não foi possível carregar o usuário.
        </Typography>
        <Button component={RouterLink} to="/" variant="outlined">
          Voltar
        </Button>
      </Box>
    )
  }

  return (
    <UserForm
      initialUser={user ?? undefined}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel={isEditMode ? 'Salvar alterações' : 'Cadastrar'}
      cancelLabel="Cancelar"
      disabled={isPending}
    />
  )
}

export default UserFormPage
