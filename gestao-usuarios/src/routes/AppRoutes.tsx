import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

// Code splitting das páginas principais usando React.lazy,
// permitindo carregamento sob demanda da listagem e do formulário.
const UserList = lazy(() => import('../pages/UserList'))
const UserFormPage = lazy(() => import('../pages/UserFormPage'))

/**
 * Declaração das rotas da aplicação.
 *
 * Responsabilidades principais:
 * - Mapear a rota raiz (`/`) para a **Listagem de Usuários**.
 * - Mapear `/users/new` e `/users/:id/edit` para o fluxo de **Cadastro/Edição**.
 * - Envolver as rotas em `Suspense` para exibir um indicador de carregamento
 *   enquanto os chunks de código são baixados (**code splitting + lazy loading**).
 */
export const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/users/new" element={<UserFormPage />} />
        <Route path="/users/:id/edit" element={<UserFormPage />} />
      </Routes>
    </Suspense>
  )
}

