/* eslint-disable @typescript-eslint/unbound-method */

/**
 * Testes automatizados da **Listagem de Usuários**.
 *
 * Garante que:
 * - A tabela exibe corretamente os usuários retornados pela API mock.
 * - Uma mensagem de erro amigável é exibida quando a requisição falha.
 */
import { renderWithProviders, screen, waitFor, testQueryClient } from '../test/test-utils'
import { api } from '../services/api'
import UserList from './UserList'

beforeEach(() => {
  testQueryClient.clear()
})

describe('UserList (integração)', () => {
  it('exibe lista de usuários carregada da API', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'João Silva',
          username: 'joao.silva',
          email: 'joao@example.com',
        },
        {
          id: 2,
          name: 'Pedro Pereira',
          username: 'pedro.pereira',
          email: 'pedro@example.com',
        },
      ],
    } as any)

    renderWithProviders(<UserList />)

    expect(
      screen.getByRole('textbox', { name: /buscar usuários por nome ou e-mail/i }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('joao@example.com')).toBeInTheDocument()
      expect(screen.getByText('Pedro Pereira')).toBeInTheDocument()
      expect(screen.getByText('pedro@example.com')).toBeInTheDocument()
    })
  })

  it('exibe mensagem de erro quando a API falha', async () => {
    jest.spyOn(api, 'get').mockRejectedValueOnce(new Error('Erro interno'))

    renderWithProviders(<UserList />)

    await waitFor(() => {
      expect(
        screen.getByText(
          /não foi possível carregar a lista de usuários\. tente novamente mais tarde\./i,
        ),
      ).toBeInTheDocument()
    })
  })
})

