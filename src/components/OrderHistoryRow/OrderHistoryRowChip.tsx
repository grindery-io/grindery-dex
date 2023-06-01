import { Chip, styled } from '@mui/material';

export const OrderHistoryRowChip = styled(Chip)({
  borderRadius: '8px',
  padding: '4px 8px !important',
  fontSize: '14px',
  lineHeight: '125%',
  '&.MuiChip-colorWarning': {
    background: '#FFF1D6',
    color: '#CC9426',
  },
  '&.MuiChip-colorSuccess': {
    background: '#B2F0DA',
    color: '#00925D',
  },
  '&.MuiChip-colorError': {
    background: '#F5D0C4',
    color: '#A32900',
  },
});
