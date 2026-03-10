import type { ReactNode } from 'react'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import PeopleIcon from '@mui/icons-material/People'
import { useColorMode } from '../theme/theme'

type MainLayoutProps = {
  children: ReactNode
}

/**
 * Layout principal da aplicação.
 *
 * Responsabilidades principais:
 * - Exibir o cabeçalho com o título do painel e o ícone de usuários.
 * - Oferecer o botão de alternância de **tema claro/escuro**, integrado ao `useColorMode`
 *   (Dark Mode persistente configurado em `theme.ts`).
 * - Definir a estrutura básica de página (AppBar fixo + conteúdo principal com espaçamento e cores de fundo).
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  const { mode, toggleColorMode } = useColorMode()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="fixed" color="primary" enableColorOnDark>
        <Toolbar>
          <PeopleIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component="h1"
            sx={{ flexGrow: 1, fontWeight: 500 }}
          >
            Painel de Gestão de Usuários
          </Typography>

          <IconButton
            color="inherit"
            edge="end"
            aria-label="alternar tema claro/escuro"
            onClick={toggleColorMode}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 3, md: 4 },
          pb: 3,
          borderRadius: '16px',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

