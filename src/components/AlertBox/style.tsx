import { Box, styled } from '@mui/material';

export const Wrapper = styled(Box)({
  margin: '20px 0 0',

  '& .MuiAlert-root': {
    padding: '20px',
    borderRadius: '5px',
  },

  '& .MuiAlert-message': {
    padding: '0',
  },

  '& .MuiAlert-icon': {
    padding: '0',

    '& svg': {
      marginTop: '0px',
    },
  },

  '& .MuiAlert-message p': {
    textAlign: 'left',
    padding: '0',
    margin: '0',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '150%',
    color: '#0b0d17',

    '& a': {
      color: '#170b10',
      textDecoration: 'underline',

      '&:hover': {
        color: '#170b10',
        textDecoration: 'none',
      },
    },
  },
});
