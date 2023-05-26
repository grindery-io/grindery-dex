import { createTheme } from '@mui/material/styles';
import '@mui/lab/themeAugmentation';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8C30F5',
    },
    secondary: {
      main: '#0B0D17',
    },
  },
  typography: {
    h1: {
      fontWeight: '700',
      fontSize: '32px',
      lineHeight: '120%',
      fontStyle: 'normal',
    },
    h2: {
      fontSize: '24px',
      color: '#363636',
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: '120%',
    },
    h3: {
      fontSize: 30,
      color: '#0B0D17',
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: '120%',
    },
  },
  components: {
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: 'rgba(255,255,255,0.6)',
          },
        },
        loading: {
          color: 'rgba(255,255,255,0.6)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          padding: '10px 20px',
          fontFamily: 'Roboto',
          fontStyle: 'normal',
          fontWeight: '700',
          fontSize: 16,
          lineHeight: '150%',
          textAlign: 'center',
          textTransform: 'none',
          color: '#FFFFFF',
          boxShadow: 'initial',
          margin: '10px 0px',
          '& span': {
            marginRight: '10px',
            '& img': {
              padding: '4px',
              backgroundColor: '#FFFFFF',
              borderRadius: 5,
              border: '1px solid #DCDCDC',
            },
          },
          '&:hover': {
            opacity: 0.7,
          },
          '&.Mui-disabled': {
            color: 'rgba(255,255,255,0.6)',
          },
        },
        containedPrimary: ({ theme }) => ({
          '&:disabled': {
            opacity: 0.4,
            backgroundColor: theme.palette.primary.main,
            color: '#FFFFFF',
          },
        }),
        containedSecondary: ({ theme }) => ({
          '&:disabled': {
            opacity: 0.4,
            backgroundColor: theme.palette.secondary.main,
            color: '#FFFFFF',
          },
        }),
        sizeSmall: {
          width: 167,
        },
        sizeLarge: {
          width: '100%',
        },
        outlinedPrimary: {
          color: '#8C30F5',
          border: '1px solid #8C30F5',
        },
        outlinedSecondary: {
          color: '#0B0D17',
          border: '1px solid #0B0D17',
        },
      },
    },
  },
});
