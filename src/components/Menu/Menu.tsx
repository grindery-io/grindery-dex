import { Menu as MuiMenu, styled } from '@mui/material';

export const Menu = styled(MuiMenu)({
  '& .MuiPaper-root': {
    marginTop: '4px',
    background: '#ffffff',
    border: '1px solid #dcdcdc',
    boxShadow: '2px 2px 24px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
  },
  '& .MuiList-root': {
    padding: '10px',
    '& .MuiButtonBase-root': {
      borderRadius: '5px',
      padding: '8px',
      '&:hover': {
        background: '#fdfbff',
      },
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: '32px !important',
    '& img': {
      width: '20px',
      height: '20px',
      maxWidth: '20px',
      display: 'block',
    },
  },
});
