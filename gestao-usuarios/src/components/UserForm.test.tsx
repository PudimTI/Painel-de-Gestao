/* eslint-disable @typescript-eslint/unbound-method */

/**
 * Testes automatizados do **Formulário de Usuário**.
 *
 * Garante que:
 * - O formulário dispara `onSubmit` com valores válidos quando o usuário preenche os campos obrigatórios.
 * - As mensagens de **validação** são exibidas quando o formulário é enviado vazio,
 *   impedindo o envio sem nome e e‑mail.
 */
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '../test/test-utils'
import { UserForm } from './UserForm'

describe('UserForm', () => {
  it('submete valores válidos e chama onSubmit', async () => {
    const handleSubmit = jest.fn()
    renderWithProviders(<UserForm onSubmit={handleSubmit} />)

    await userEvent.type(
      screen.getByLabelText(/nome/i),
      'João da Silva',
    )
    await userEvent.type(
      screen.getByPlaceholderText(/joao\.silva/i),
      'joao_silva',
    )
    await userEvent.type(
      screen.getByLabelText(/e-mail/i),
      'joao@example.com',
    )

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    const submittedValues = handleSubmit.mock.calls[0][0]
    expect(submittedValues).toMatchObject({
      name: 'João da Silva',
      username: 'joao_silva',
      email: 'joao@example.com',
      status: 'active',
    })
  })

  it('mostra mensagens de erro de validação quando campos estão vazios', async () => {
    const handleSubmit = jest.fn()
    renderWithProviders(<UserForm onSubmit={handleSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/erros de validação/i)
    expect(alert).toHaveTextContent(/nome/i)
    expect(alert).toHaveTextContent(/usuário/i)
    expect(alert).toHaveTextContent(/e-mail/i)
    expect(handleSubmit).not.toHaveBeenCalled()
  })
})

