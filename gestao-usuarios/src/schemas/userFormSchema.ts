import { z } from 'zod'
import type { UserStatus } from '../hooks/useUsers'

export const userFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .refine((v) => v.trim().length >= 3, 'Nome deve ter no mínimo 3 caracteres')
    .refine((v) => v.trim().length <= 100, 'Nome deve ter no máximo 100 caracteres'),
  username: z
    .string()
    .min(1, 'Usuário é obrigatório')
    .refine((v) => v.trim().length >= 3, 'Usuário deve ter no mínimo 3 caracteres')
    .refine((v) => v.trim().length <= 50, 'Usuário deve ter no máximo 50 caracteres')
    .refine(
      (v) => /^[a-zA-Z0-9_-]+$/.test(v.trim()),
      'Usuário deve conter apenas letras, números, hífen ou underscore',
    ),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido')
    .max(255, 'E-mail deve ter no máximo 255 caracteres'),
  status: z.enum(['active', 'inactive'] as const satisfies readonly UserStatus[]),
  address: z.object({
    street: z
      .string()
      .max(255, 'Logradouro deve ter no máximo 255 caracteres')
      .optional()
      .or(z.literal('')),
    suite: z
      .string()
      .max(255, 'Complemento deve ter no máximo 255 caracteres')
      .optional()
      .or(z.literal('')),
    city: z
      .string()
      .max(120, 'Cidade deve ter no máximo 120 caracteres')
      .optional()
      .or(z.literal('')),
    zipcode: z
      .string()
      .max(20, 'CEP deve ter no máximo 20 caracteres')
      .optional()
      .or(z.literal('')),
    geo: z.object({
      lat: z
        .string()
        .max(30, 'Latitude deve ter no máximo 30 caracteres')
        .optional()
        .or(z.literal('')),
      lng: z
        .string()
        .max(30, 'Longitude deve ter no máximo 30 caracteres')
        .optional()
        .or(z.literal('')),
    }),
  }),
  phone: z
    .string()
    .max(50, 'Telefone deve ter no máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .max(255, 'Website deve ter no máximo 255 caracteres')
    .optional()
    .or(z.literal('')),
})

export type UserFormValues = z.infer<typeof userFormSchema>
