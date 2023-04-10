import { Box, styled } from '@mui/material';

export const ButtonWrapper = styled(Box)({
  margin: '10px 0 0',
  textAlign: 'right',
  padding: '0 0 10px',
  '& button': {
    backgroundColor: '#3f49e1',
    fontWeight: 400,
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'rgb(50, 58, 180)',
      opacity: 1,
      boxShadow: 'none',
    },
  },
});
