import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppThemeProvider } from '../theme/theme'
import { SnackbarProvider } from '../contexts/SnackbarContext'
import { MainLayout } from '../components/MainLayout'

type RootState = Record<string, unknown>

export type AppStore = EnhancedStore<RootState>

const createTestStore = (): AppStore =>
  configureStore({
    reducer: {},
  })

type ProvidersProps = {
  children: ReactNode
  store?: AppStore
  initialEntries?: string[]
}

export const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const Providers = ({ children, store, initialEntries }: ProvidersProps) => {
  return (
    <ReduxProvider store={store ?? createTestStore()}>
      <QueryClientProvider client={testQueryClient}>
        <AppThemeProvider>
          <SnackbarProvider>
            <MemoryRouter initialEntries={initialEntries}>
              <MainLayout>{children}</MainLayout>
            </MemoryRouter>
          </SnackbarProvider>
        </AppThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  )
}

export type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  route?: string
  store?: AppStore
}

export const renderWithProviders = (
  ui: ReactElement,
  { route = '/', store, ...renderOptions }: CustomRenderOptions = {},
) => {
  const initialEntries = [route]

  return render(ui, {
    wrapper: ({ children }) => (
      <Providers store={store} initialEntries={initialEntries}>
        {children}
      </Providers>
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'

