import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const UserContainer = styled(Box)({
  position: 'relative',
});

export const UserWrapper = styled(Box)({
  border: '1px solid #dcdcdc',
  borderRadius: 34,
  padding: '8px 12px 8px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: 8,
  cursor: 'pointer',
  transition: 'border-color 0.2s ease-in-out',

  '&:hover, &.opened': {
    borderColor: '#0b0d17 !important',
  },

  '&.dark:hover, &.dark.opened': {
    borderColor: '#ffffff !important',
  },
});

export const UserStatus = styled(Box)({
  background: '#f4f5f7',
  width: 24,
  height: 24,
  borderRadius: 12,
  boxSizing: 'border-box',
  padding: '2px',
});

export const UserId = styled(Box)({
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '150%',
  margin: 0,
  padding: 0,

  '&.dark': {
    color: '#ffffff',
  },
});
