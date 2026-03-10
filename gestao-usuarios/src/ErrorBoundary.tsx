import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

/**
 * ErrorBoundary personalizado da aplicação.
 *
 * Responsabilidades principais:
 * - Capturar erros de renderização em qualquer ponto abaixo na árvore de componentes React.
 * - Exibir uma interface amigável com mensagem de erro, opção de **tentar novamente** e **recarregar a página**.
 * - Em ambiente de desenvolvimento, registrar o erro no console para facilitar o debug.
 * - Proteger o usuário final de telas em branco ou mensagens de erro técnicas.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo)
    }
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            px: 2,
          }}
        >
          <Box maxWidth={480} width="100%">
            <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
              <Typography variant="h6" component="h1">
                Ocorreu um erro inesperado
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Algo saiu errado ao renderizar esta página. Tente recarregar ou voltar mais
                tarde.
              </Typography>
            </Alert>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" color="inherit" onClick={() => this.setState({ hasError: false })}>
                Tentar novamente
              </Button>
              <Button variant="contained" color="primary" onClick={this.handleReload}>
                Recarregar página
              </Button>
            </Box>
          </Box>
        </Box>
      )
    }

    return this.props.children
  }
}

