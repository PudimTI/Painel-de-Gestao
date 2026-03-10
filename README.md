# Painel de Gestão de Usuários - Desafio Técnico Zucchetti

Este projeto consiste em uma aplicação React voltada para a gestão de usuários, permitindo listar, criar, editar e excluir registros de forma eficiente. O objetivo é demonstrar competência em desenvolvimento estruturado, boas práticas, integração com APIs e automação de testes.

## Tecnologias e Arquitetura

Para atender aos requisitos técnicos e diferenciais propostos, utilizei as seguintes tecnologias:

- **Core:** React (Hooks e Componentes Funcionais) com TypeScript para tipagem estática e segurança.
- **Gerenciamento de Estado:**
    - **React Query (TanStack Query):** Utilizado para gerenciamento de estado do servidor, cache e invalidação automática de dados.
    - **Redux Toolkit:** Para gerenciamento de estado global da UI, como o Dark Mode.
- **UI/UX:** Material-UI (MUI) para componentes visuais e interface responsiva.
- **Formulários:** React Hook Form integrado ao Zod para validações robustas.
- **Testes:** Jest e React Testing Library para testes unitários e de integração.
- **Qualidade:** ESLint e Prettier para padronização de código.

## Diferenciais Implementados

Focando no perfil Sênior, os seguintes recursos foram adicionados:

- **React Query:** Implementação de invalidação e refetch automático após mutações.
- **Dark Mode:** Persistência de tema com useMediaQuery e integração com o sistema operacional.
- **ErrorBoundary:** Captura e tratamento de falhas em tempo de execução para evitar crashes.
- **Code Splitting:** Otimização de performance com React.lazy() e Suspense para carregamento sob demanda.
- **Acessibilidade (a11y):** Foco navegável via teclado e uso correto de atributos ARIA.
- **CI/CD:** Pipeline configurada no GitHub Actions para linting, testes e build automatizado.
- **Documentação:** Componentes principais documentados no Storybook.

## Instalação e Execução

Para rodar o projeto localmente, siga os passos abaixo:

1. **Clone o repositório:**

```
git clone https://github.com/
```

2. **Acesse o diretório:**

```
cd gestao-usuarios
```

3. **Instale as dependências:**

```
npm install
```

4. **Inicie o servidor de desenvolvimento:**

```
npm run dev
```

5. **Acesse no navegador:** http://localhost:5173

## Testes Automatizados

A aplicação conta com testes de renderização, interações de usuário e integração de estado global:

- **Rodar testes:**

```
npm test
```

- **Rodar com Coverage:**

```
npm run test:coverage
```

## Links

- **API Utilizada:** https://jsonplaceholder.typicode.com/users
- **Storybook:** 

## Prints


