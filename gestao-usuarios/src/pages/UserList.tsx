import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import type { User } from '../hooks/useUsers'
import { useUsers } from '../hooks/useUsers'
import { useDeleteUser } from '../hooks/useUserMutations'

/**
 * Página de **Listagem de Usuários**.
 *
 * Responsabilidades principais:
 * - Buscar usuários da API mock via React Query e exibir em uma tabela com colunas de **nome**, **e-mail** e **status**.
 * - Permitir **ordenar** por nome e e-mail usando `TableSortLabel` (asc/desc) e **filtrar** por texto digitado (nome ou e‑mail).
 * - Integrar com a mutation de exclusão (`useDeleteUser`), exibindo um **diálogo de confirmação** antes de remover o usuário da lista.
 * - Garantir acessibilidade básica com rótulos ARIA em campos, botões e na tabela.
 */

type Order = 'asc' | 'desc'

type OrderBy = 'name' | 'email'

// Função de ordenação estável para a lista em memória,
// respeitando a coluna escolhida (nome ou e-mail) e a direção (asc/desc).
const sortUsers = (users: User[], orderBy: OrderBy, order: Order) => {
  return [...users].sort((a, b) => {
    const aValue = a[orderBy].toLowerCase()
    const bValue = b[orderBy].toLowerCase()

    if (aValue < bValue) return order === 'asc' ? -1 : 1
    if (aValue > bValue) return order === 'asc' ? 1 : -1
    return 0
  })
}

const UserList = () => {
  const { users, isLoading, isError } = useUsers()
  const deleteMutation = useDeleteUser()

  const [search, setSearch] = useState('')
  const [orderBy, setOrderBy] = useState<OrderBy>('name')
  const [order, setOrder] = useState<Order>('asc')
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const handleRequestSort = (property: OrderBy) => {
    setOrder((prevOrder) => (orderBy === property && prevOrder === 'asc' ? 'desc' : 'asc'))
    setOrderBy(property)
  }

  const filteredAndSortedUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const filtered = normalizedSearch
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(normalizedSearch) ||
            user.email.toLowerCase().includes(normalizedSearch),
        )
      : users

    return sortUsers(filtered, orderBy, order)
  }, [users, search, orderBy, order])

  const hasFilter = search.trim().length > 0

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    await deleteMutation.mutateAsync(userToDelete.id)
    setUserToDelete(null)
  }

  const handleCloseDialog = () => {
    if (deleteMutation.isPending) return
    setUserToDelete(null)
  }

  return (
    <Box sx={{ pt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Usuários
      </Typography>

      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          label="Buscar por nome ou e-mail"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          inputProps={{ 'aria-label': 'Buscar usuários por nome ou e-mail' }}
        />

        <Button
          component={RouterLink}
          to="/users/new"
          variant="contained"
          color="primary"
          aria-label="Cadastrar novo usuário"
          sx={{
            textAlign: 'center',
            justifyContent: 'center',
            display: 'inline-flex',   
            borderRadius: '10px',
          }}
        >
          Novo usuário
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table size="medium" aria-label="Tabela de usuários">
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 'bold' } }}>
                <TableCell
                  sortDirection={orderBy === 'name' ? order : false}
                  aria-sort={
                    orderBy === 'name' ? (order === 'asc' ? 'ascending' : 'descending') : 'none'
                  }
                >
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                    aria-label="Ordenar por nome"
                  >
                    Nome
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === 'email' ? order : false}
                  aria-sort={
                    orderBy === 'email' ? (order === 'asc' ? 'ascending' : 'descending') : 'none'
                  }
                >
                  <TableSortLabel
                    active={orderBy === 'email'}
                    direction={orderBy === 'email' ? order : 'asc'}
                    onClick={() => handleRequestSort('email')}
                    aria-label="Ordenar por e-mail"
                  >
                    E-mail
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width="70%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={80} height={28} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={80} height={32} />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && isError && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="error">
                      Não foi possível carregar a lista de usuários. Tente novamente mais tarde.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.status === 'active' ? 'Ativo' : 'Inativo'}
                        color={user.status === 'active' ? 'success' : 'default'}
                        size="small"
                        aria-label={`Status do usuário ${user.name}: ${
                          user.status === 'active' ? 'Ativo' : 'Inativo'
                        }`}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        component={RouterLink}
                        to={`/users/${user.id}/edit`}
                        variant="outlined"
                        size="small"
                        aria-label={`Editar usuário ${user.name}`}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        aria-label={`Excluir usuário ${user.name}`}
                        onClick={() => setUserToDelete(user)}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && !isError && filteredAndSortedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="body2" color="text.secondary">
                      {hasFilter
                        ? 'Nenhum usuário encontrado para o filtro aplicado.'
                        : 'Nenhum usuário encontrado.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={userToDelete != null}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Tem certeza que deseja excluir o usuário{' '}
            <strong>{userToDelete?.name}</strong>? Essa ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={deleteMutation.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={deleteMutation.isPending}
            autoFocus
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserList

