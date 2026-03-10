import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Configuração de tema (claro/escuro) da aplicação.
 *
 * Responsabilidades principais:
 * - Criar um contexto (`ColorModeContext`) que expõe o modo atual (`light`/`dark`) e ações para alternar/forçar o modo.
 * - Detectar a preferência de tema do sistema operacional via `useMediaQuery('(prefers-color-scheme: dark)')`.
 * - **Persistir o Dark Mode** no `localStorage`, usando a chave `color-scheme`, para que a escolha do usuário
 *   seja mantida entre recarregamentos.
 * - Gerar temas MUI para claro/escuro e envolver a aplicação com `ThemeProvider` + `CssBaseline`.
 */

type ColorModeContextValue = {
  mode: PaletteMode;
  toggleColorMode: () => void;
  setMode: (mode: PaletteMode) => void;
};

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

const COLOR_SCHEME_STORAGE_KEY = 'color-scheme';

const getStoredMode = (): PaletteMode | null => {
  if (typeof window === 'undefined') return null;

  try {
    const value = window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    if (value === 'light' || value === 'dark') {
      return value;
    }
    return null;
  } catch {
    return null;
  }
};

const storeMode = (mode: PaletteMode) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, mode);
  } catch {
    // ignore storage errors
  }
};

const getDesignTokens = (mode: PaletteMode) =>
  ({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      secondary: {
        main: mode === 'light' ? '#9c27b0' : '#ce93d8',
      },
      ...(mode === 'dark'
        ? {
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
              secondary: '#bbbbbb',
            },
          }
        : {
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
            text: {
              primary: '#000000',
              secondary: '#555555',
            },
          }),
    },
  }) as const;

export const lightTheme = createTheme(getDesignTokens('light'));

export const darkTheme = createTheme(getDesignTokens('dark'));

type AppThemeProviderProps = {
  children: ReactNode;
};

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [mode, setModeState] = useState<PaletteMode>(() => {
    const stored = getStoredMode();
    if (stored) return stored;
    return prefersDarkMode ? 'dark' : 'light';
  });

  useEffect(() => {
    const stored = getStoredMode();
    if (!stored) {
      setModeState(prefersDarkMode ? 'dark' : 'light');
    }
  }, [prefersDarkMode]);

  const setMode = useCallback((newMode: PaletteMode) => {
    setModeState(newMode);
    storeMode(newMode);
  }, []);

  const toggleColorMode = useCallback(() => {
    setModeState((prev: PaletteMode) => {
      const nextMode: PaletteMode = prev === 'light' ? 'dark' : 'light';
      storeMode(nextMode);
      return nextMode;
    });
  }, []);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const contextValue = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      toggleColorMode,
      setMode,
    }),
    [mode, toggleColorMode, setMode],
  );

  const inner = React.createElement(
    ThemeProvider,
    { theme },
    React.createElement(
      React.Fragment,
      null,
      React.createElement(CssBaseline, null),
      children,
    ),
  );

  return React.createElement(ColorModeContext.Provider, {
    value: contextValue,
    children: inner,
  });
};

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode deve ser usado dentro de AppThemeProvider');
  }
  return context;
};

