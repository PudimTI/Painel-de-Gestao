import axios from 'axios'

/**
 * Cliente HTTP base da aplicação.
 *
 * Responsabilidades principais:
 * - Configurar a **integração com API mock**, apontando o `baseURL` para `jsonplaceholder.typicode.com`
 *   (ou outro backend compatível, como um `json-server` local com a mesma estrutura de rotas).
 * - Centralizar headers comuns para que todos os serviços (`services/users.ts`, `hooks/useUsers.ts`) reutilizem
 *   a mesma instância de `axios`.
 */
export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
})
