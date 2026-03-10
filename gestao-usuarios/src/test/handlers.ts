import { http, HttpResponse } from 'msw'
import type { User } from '../hooks/useUsers'

const baseURL = 'https://jsonplaceholder.typicode.com'

const usersFixture: User[] = [
  {
    id: 1,
    name: 'João Silva',
    username: 'joao.silva',
    email: 'joao@example.com',
    status: 'inactive',
  },
  {
    id: 2,
    name: 'Maria Souza',
    username: 'maria.souza',
    email: 'maria@example.com',
    status: 'active',
  },
]

export const handlers = [
  http.get(`${baseURL}/users`, () => {
    const apiUsers = usersFixture.map(({ id, name, username, email }) => ({
      id,
      name,
      username,
      email,
    }))

    return HttpResponse.json(apiUsers)
  }),

  http.get(`${baseURL}/users/:id`, ({ params }) => {
    const id = Number(params.id)
    const user = usersFixture.find((u) => u.id === id)

    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }

    const { name, username, email } = user

    return HttpResponse.json({ id, name, username, email })
  }),
]

