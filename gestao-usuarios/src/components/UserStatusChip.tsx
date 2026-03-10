import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';

type UserStatus = 'active' | 'inactive';

type UserStatusChipProps = Omit<ChipProps, 'label' | 'color'> & {
  status: UserStatus;
  userName?: string;
};

const STATUS_CONFIG: Record<
  UserStatus,
  {
    label: string;
    color: ChipProps['color'];
  }
> = {
  active: {
    label: 'Ativo',
    color: 'success',
  },
  inactive: {
    label: 'Inativo',
    color: 'default',
  },
};

export const UserStatusChip = ({ status, userName, ...chipProps }: UserStatusChipProps) => {
  const config = STATUS_CONFIG[status];

  const ariaLabel = userName
    ? `Status do usuário ${userName}: ${config.label}`
    : `Status do usuário: ${config.label}`;

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      aria-label={ariaLabel}
      {...chipProps}
    />
  );
};

