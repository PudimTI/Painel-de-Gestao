import type { Meta, StoryObj } from '@storybook/react';
import { UserStatusChip } from './UserStatusChip';

const meta: Meta<typeof UserStatusChip> = {
  title: 'Usuários/UserStatusChip',
  component: UserStatusChip,
  args: {
    userName: 'João Silva',
  },
  argTypes: {
    status: {
      options: ['active', 'inactive'],
      control: { type: 'radio' },
      description: 'Status do usuário representado pelo chip',
    },
  },
  parameters: {
    a11y: {
      // Mantém o addon de acessibilidade ativo para conferir contraste e semântica
      disable: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof UserStatusChip>;

export const Ativo: Story = {
  args: {
    status: 'active',
  },
};

export const Inativo: Story = {
  args: {
    status: 'inactive',
  },
};

