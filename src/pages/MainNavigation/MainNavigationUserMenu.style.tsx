import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const UserContainer = styled(Box)({
  position: 'relative',
});

export const UserWrapper = styled(Box)({
  border: '1px solid #dcdcdc',
  borderRadius: 34,
  padding: '7px 12px 7px 8px',
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

export const UserDropdown = styled(Box)({
  position: 'absolute',
  right: 0,
  top: '100%',
  paddingTop: '4px',
  opacity: 0,
  visibility: 'hidden',
  transition: 'all 0.3s ease-in-out',
  transform: 'translateY(-10px)',
  zIndex: 99,

  '&.opened': {
    opacity: 1,
    visibility: 'visible',
    transform: 'translateY(0px)',
  },
});

export const UserDropdownContent = styled(Box)({
  background: '#ffffff',
  border: '1px solid #dcdcdc',
  boxShadow: '2px 2px 24px rgba(0, 0, 0, 0.15)',
  borderRadius: 10,
  padding: '10px',

  '& button': {
    fontFamily: 'Roboto',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    borderRadius: 5,
    border: 'none',
    gap: '10px',
    cursor: 'pointer',
    padding: '8px',
    width: '100%',
    boxSizing: 'border-box',

    '& img': {
      width: 20,
      height: 20,
    },

    '&:hover': {
      background: '#fdfbff',
    },

    '& span': {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '160%',
      color: '#141416',
      whiteSpace: 'nowrap',
    },
  },
});
