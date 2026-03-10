import type { AxiosError } from 'axios'
import { getErrorMessage } from './errorMessage'

const createAxiosError = (status?: number, data?: unknown): AxiosError => {
  const statusCode = status ?? 400

  const error = new Error('Erro da API') as AxiosError & {
    response: {
      isAxiosError?: boolean
      status: number
      statusText: string
      headers: Record<string, string>
      config: unknown
      data: unknown
    }
  }

  error.response = {
    status: statusCode,
    statusText: String(statusCode),
    headers: {},
    // Estrutura mínima para satisfazer o tipo de configuração
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: { headers: {} } as any,
    data,
  }

  // Garante que seja identificado como erro do Axios
  ;(error as { isAxiosError?: boolean }).isAxiosError = true

  return error
}

describe('getErrorMessage', () => {
  it('retorna mensagem da resposta quando data.message existe', () => {
    const error = createAxiosError(400, { message: 'Mensagem da API' })

    expect(getErrorMessage(error)).toBe('Mensagem da API')
  })

  it('retorna mensagem amigável para códigos HTTP conhecidos', () => {
    expect(getErrorMessage(createAxiosError(404))).toBe('Recurso não encontrado.')
    expect(getErrorMessage(createAxiosError(422))).toBe(
      'Dados inválidos. Verifique os campos.',
    )
    expect(getErrorMessage(createAxiosError(500))).toBe(
      'Erro no servidor. Tente novamente mais tarde.',
    )
  })

  it('retorna fallback para erro desconhecido', () => {
    const fallback = 'Falha inesperada'
    expect(getErrorMessage('erro qualquer', fallback)).toBe(fallback)
  })
})

