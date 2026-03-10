import { isAxiosError } from 'axios'

/**
 * Extrai mensagem de erro amigável de erros do Axios ou Error genérico.
 */
export const getErrorMessage = (
  error: unknown,
  fallback = 'Ocorreu um erro inesperado. Tente novamente.',
): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'object' && data != null && 'message' in data) {
      return String((data as { message: unknown }).message)
    }
    if (error.response?.status === 404) return 'Recurso não encontrado.'
    if (error.response?.status === 422) return 'Dados inválidos. Verifique os campos.'
    if (error.response?.status && error.response.status >= 500) {
      return 'Erro no servidor. Tente novamente mais tarde.'
    }
    return error.message || fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}
