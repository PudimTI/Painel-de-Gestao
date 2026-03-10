import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Alert, Snackbar } from '@mui/material'

type Severity = 'success' | 'error' | 'info' | 'warning'

type SnackbarState = {
  open: boolean
  message: string
  severity: Severity
}

type SnackbarContextValue = {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  showWarning: (message: string) => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)

const initialState: SnackbarState = {
  open: false,
  message: '',
  severity: 'info',
}

type SnackbarProviderProps = {
  children: ReactNode
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [state, setState] = useState<SnackbarState>(initialState)

  const show = useCallback((message: string, severity: Severity) => {
    setState({ open: true, message, severity })
  }, [])

  const showSuccess = useCallback((message: string) => show(message, 'success'), [show])
  const showError = useCallback((message: string) => show(message, 'error'), [show])
  const showInfo = useCallback((message: string) => show(message, 'info'), [show])
  const showWarning = useCallback((message: string) => show(message, 'warning'), [show])

  const handleClose = useCallback(
    (_?: unknown, reason?: string) => {
      if (reason === 'clickaway') return
      setState((prev) => ({ ...prev, open: false }))
    },
    [],
  )

  const value = useMemo<SnackbarContextValue>(
    () => ({ showSuccess, showError, showInfo, showWarning }),
    [showSuccess, showError, showInfo, showWarning],
  )

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        role="status"
        aria-live="polite"
      >
        <Alert
          onClose={() => handleClose()}
          severity={state.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar deve ser usado dentro de SnackbarProvider')
  }
  return context
}
