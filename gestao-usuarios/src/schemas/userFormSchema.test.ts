import { userFormSchema } from './userFormSchema'

describe('userFormSchema', () => {
  it('aceita valores válidos', () => {
    const parsed = userFormSchema.parse({
      name: 'João Silva',
      username: 'joao_silva',
      email: 'joao@example.com',
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
    })

    expect(parsed).toMatchObject({
      name: 'João Silva',
      username: 'joao_silva',
      email: 'joao@example.com',
      status: 'active',
    })
  })

  it('rejeita nome muito curto', () => {
    const result = userFormSchema.safeParse({
      name: 'Jo',
      username: 'usuario',
      email: 'teste@example.com',
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
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      expect(fieldErrors.name?.[0]).toContain('Nome deve ter no mínimo 3 caracteres')
    }
  })

  it('rejeita username com caracteres inválidos', () => {
    const result = userFormSchema.safeParse({
      name: 'Nome Válido',
      username: 'inválido!',
      email: 'teste@example.com',
      status: 'inactive',
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
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      expect(fieldErrors.username?.[0]).toContain(
        'Usuário deve conter apenas letras, números, hífen ou underscore',
      )
    }
  })
})

