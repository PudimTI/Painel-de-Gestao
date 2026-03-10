import { useEffect, useId } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { UserFormValues } from '../schemas/userFormSchema'
import { userFormSchema } from '../schemas/userFormSchema'
import type { User } from '../hooks/useUsers'

/**
 * Formulário de **Cadastro e Edição** de usuário.
 *
 * Responsabilidades principais:
 * - Centralizar o formulário com todos os campos do usuário, aplicando **validação com Zod + React Hook Form**
 *   (campos **nome** e **e‑mail** são obrigatórios, e demais campos opcionais seguem o schema).
 * - Reutilizar o mesmo componente tanto para **criar** quanto para **editar** usuários, recebendo `initialUser`
 *   e rótulos configuráveis de botões.
 * - Enviar os dados normalizados via `onSubmit` para que a tela (`UserFormPage`) dispare as mutations de criação/edição
 *   e atualize o estado global do React Query (refletindo a mudança na listagem).
 * - Aplicar preocupações de **acessibilidade** (ARIA, foco automático no primeiro erro, resumo de erros invisível para tela).
 */

export type UserFormProps = {
  initialUser?: Partial<User> | null
  onSubmit: SubmitHandler<UserFormValues>
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  disabled?: boolean
  title?: string
}

// Valores padrão do formulário, usados quando não há usuário inicial (modo de cadastro).
const defaultValues: UserFormValues = {
  name: '',
  username: '',
  email: '',
  status: 'active',
  address: {
    street: '',
    suite: '',
    city: '',
    zipcode: '',
    geo: {
      lat: '',
      lng: '',
    },
  },
  phone: '',
  website: '',
}

export const UserForm = ({
  initialUser,
  onSubmit,
  onCancel,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  disabled = false,
  title,
}: UserFormProps) => {
  const errorSummaryId = useId()
  const {
    register,
    handleSubmit,
    control,
    setFocus,
    formState: { errors, isSubmitting, isDirty, isSubmitted },
  } = useForm({
    resolver: zodResolver(userFormSchema),
    mode: 'onTouched',
    defaultValues: initialUser
      ? {
          name: initialUser.name ?? '',
          username: initialUser.username ?? '',
          email: initialUser.email ?? '',
          status: initialUser.status ?? 'active',
          address: {
            street: initialUser.address?.street ?? '',
            suite: initialUser.address?.suite ?? '',
            city: initialUser.address?.city ?? '',
            zipcode: initialUser.address?.zipcode ?? '',
            geo: {
              lat: initialUser.address?.geo?.lat ?? '',
              lng: initialUser.address?.geo?.lng ?? '',
            },
          },
          phone: initialUser.phone ?? '',
          website: initialUser.website ?? '',
        }
      : defaultValues,
  })

  const isFormDisabled = disabled || isSubmitting
  const hasErrors = Object.keys(errors).length > 0
  const firstErrorField = (
    ['name', 'username', 'email', 'status'] as const
  ).find((key) => errors[key])

  useEffect(() => {
    if (isSubmitted && firstErrorField != null) {
      setFocus(firstErrorField)
    }
  }, [isSubmitted, firstErrorField, setFocus])

  const displayTitle = title ?? (initialUser ? 'Editar usuário' : 'Novo usuário')
  const errorSummary = hasErrors
    ? `Erros de validação: ${Object.values(errors)
        .map((e) => e?.message)
        .filter(Boolean)
        .join('. ')}`
    : undefined

  return (
    <Box
      sx={{
        p: 3,
        pt: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom id="form-title">
        {displayTitle}
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 480 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-labelledby="form-title"
          aria-describedby={hasErrors ? errorSummaryId : undefined}
          aria-label="Formulário de usuário"
        >
          {hasErrors && (
            <div
              id={errorSummaryId}
              role="alert"
              aria-live="polite"
              className="sr-only"
            >
              {errorSummary}
            </div>
          )}
          <Stack spacing={2}>
            <TextField
              label="Nome"
              fullWidth
              required
              disabled={isFormDisabled}
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              autoComplete="name"
              placeholder="Ex.: João Silva"
            />

            <TextField
              label="Usuário"
              fullWidth
              disabled={isFormDisabled}
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
              autoComplete="username"
              placeholder="Ex.: joao.silva"
            />

            <TextField
              label="E-mail"
              type="email"
              fullWidth
              required
              disabled={isFormDisabled}
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
              placeholder="Ex.: joao@exemplo.com"
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status} disabled={isFormDisabled}>
                  <InputLabel id="user-status-label">Status</InputLabel>
                  <Select
                    {...field}
                    labelId="user-status-label"
                    label="Status"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  >
                    <MenuItem value="active">Ativo</MenuItem>
                    <MenuItem value="inactive">Inativo</MenuItem>
                  </Select>
                  {errors.status && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Typography variant="h6" mt={2}>
              Endereço
            </Typography>

            <TextField
              label="Logradouro"
              fullWidth
              disabled={isFormDisabled}
              {...register('address.street')}
              error={!!errors.address?.street}
              helperText={errors.address?.street?.toString()}
              autoComplete="street-address"
              placeholder="Ex.: Kulas Light"
            />

            <TextField
              label="Complemento"
              fullWidth
              disabled={isFormDisabled}
              {...register('address.suite')}
              error={!!errors.address?.suite}
              helperText={errors.address?.suite?.toString()}
              placeholder="Ex.: Apt. 556"
            />

            <TextField
              label="Cidade"
              fullWidth
              disabled={isFormDisabled}
              {...register('address.city')}
              error={!!errors.address?.city}
              helperText={errors.address?.city?.toString()}
              placeholder="Ex.: Gwenborough"
            />

            <TextField
              label="CEP"
              fullWidth
              disabled={isFormDisabled}
              {...register('address.zipcode')}
              error={!!errors.address?.zipcode}
              helperText={errors.address?.zipcode?.toString()}
              placeholder="Ex.: 92998-3874"
            />

            <Typography variant="h6" mt={2}>
              Geo (opcional)
            </Typography>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Latitude"
                fullWidth
                disabled={isFormDisabled}
                {...register('address.geo.lat')}
                error={!!errors.address?.geo?.lat}
                helperText={errors.address?.geo?.lat?.toString()}
                placeholder="-37.3159"
              />

              <TextField
                label="Longitude"
                fullWidth
                disabled={isFormDisabled}
                {...register('address.geo.lng')}
                error={!!errors.address?.geo?.lng}
                helperText={errors.address?.geo?.lng?.toString()}
                placeholder="81.1496"
              />
            </Stack>

            <Typography variant="h6" mt={2}>
              Contato
            </Typography>

            <TextField
              label="Telefone"
              fullWidth
              disabled={isFormDisabled}
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.toString()}
              placeholder="Ex.: 1-770-736-8031 x56442"
            />

            <TextField
              label="Website"
              fullWidth
              disabled={isFormDisabled}
              {...register('website')}
              error={!!errors.website}
              helperText={errors.website?.toString()}
              placeholder="Ex.: hildegard.org"
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              {onCancel && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={onCancel}
                  disabled={isFormDisabled}
                >
                  {cancelLabel}
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={
                  isFormDisabled ||
                  (!isDirty && !!initialUser) ||
                  hasErrors
                }
              >
                {submitLabel}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
