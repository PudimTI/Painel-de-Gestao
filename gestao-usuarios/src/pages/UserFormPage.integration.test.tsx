/* Integração: fluxo completo de criação de usuário */

/**
 * Teste de integração do fluxo de **Cadastro de Usuário**.
 *
 * Garante que:
 * - Ao submeter o formulário na tela `UserFormPage`, a mutation de criação é chamada.
 * - O cache global do React Query (`USERS_QUERY_KEY`) é atualizado com o novo usuário,
 *   refletindo imediatamente na listagem sem depender de refetch da API mock.
 */
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor, testQueryClient } from '../test/test-utils'
import { USERS_QUERY_KEY } from '../hooks/useUserMutations'
import type { User } from '../hooks/useUsers'
import UserFormPage from './UserFormPage'

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
}))

describe('UserFormPage - fluxo de criação de usuário', () => {
  it('dispara mutation de criação e atualiza o cache global de usuários', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })

    const initialUsers: User[] = [
      {
        id: 1,
        name: 'Usuário Existente',
        username: 'usuario.existente',
        email: 'existente@example.com',
        status: 'active',
      },
    ]

    testQueryClient.setQueryData<User[]>(USERS_QUERY_KEY, initialUsers)

    renderWithProviders(<UserFormPage />)

    await user.type(screen.getByLabelText(/nome/i), 'João da Silva')
    await user.type(screen.getByPlaceholderText(/joao\.silva/i), 'joao_silva')
    await user.type(screen.getByPlaceholderText(/joao@exemplo\.com/i), 'joao@example.com')

    await user.click(
      screen.getByRole('button', {
        name: /cadastrar/i,
      }),
    )

    await waitFor(() => {
      const latestUsers = testQueryClient.getQueryData<User[]>(USERS_QUERY_KEY)

      expect(latestUsers).toBeDefined()
      expect(latestUsers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'João da Silva',
            email: 'joao@example.com',
          }),
        ]),
      )
    })
  })
})

