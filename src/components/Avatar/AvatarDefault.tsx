import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AvatarDefault = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  borderRadius: '50%',
}));
