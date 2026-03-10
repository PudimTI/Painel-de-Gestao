import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'
import { SnackbarProvider } from './contexts/SnackbarContext'
import { AppRoutes } from './routes/AppRoutes'
import { AppThemeProvider } from './theme/theme'
import { MainLayout } from './components/MainLayout'

/**
 * Componente raiz da aplicação.
 *
 * Responsabilidades principais:
 * - Configurar o **React Query** para toda a árvore (incluindo políticas de refetch automático e `staleTime`).
 * - Envolver a interface com o `AppThemeProvider`, que aplica o tema do MUI e permite **Dark Mode persistente**.
 * - Fornecer um `ErrorBoundary` global para capturar falhas em tempo de execução na árvore de componentes.
 * - Habilitar o roteamento (`BrowserRouter`), o layout padrão (`MainLayout`) e o contexto de mensagens (`SnackbarProvider`).
 * - Expor as devtools do React Query em desenvolvimento para inspeção de cache e queries.
 */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: import.meta.env.DEV ? false : 'always',
      staleTime: 1000 * 60, // 1 minuto
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <SnackbarProvider>
              <MainLayout>
                <AppRoutes />
              </MainLayout>
            </SnackbarProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </AppThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
