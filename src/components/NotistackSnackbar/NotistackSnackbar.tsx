import { MaterialDesignContent } from 'notistack';
import { styled } from '@mui/material';

export const NotistackSnackbar = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent': {
    borderRadius: '4px',
    boxShadow: 'none',
    maxWidth: '400px',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    paddingBottom: '4px',
    '& .MuiButton-root': {
      color: 'inherit',
      backgroundColor: 'transparent',
      padding: '4px 6px',
      fontSize: '13px',
      margin: '3px 0 0',
      width: 'auto',
    },
    '& .notistack__close': {
      marginTop: '3px',
    },
    '& #notistack-snackbar': {
      alignItems: 'flex-start',
      '& svg': {
        marginTop: '-2px',
      },
    },
  },
  '&.notistack-MuiContent-success': {
    backgroundColor: 'rgb(237, 247, 237)',
    color: 'rgb(30, 70, 32)',
    '& svg': {
      color: 'rgb(46, 125, 50)',
    },
    '& .notistack__close svg': {
      color: 'rgb(30, 70, 32)',
    },
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: 'rgb(253, 237, 237)',
    color: 'rgb(95, 33, 32)',
    '& svg': {
      color: 'rgb(211, 47, 47)',
    },
    '& .notistack__close svg': {
      color: 'rgb(95, 33, 32)',
    },
  },
  '&.notistack-MuiContent-info': {
    backgroundColor: 'rgb(229, 246, 253)',
    color: 'rgb(1, 67, 97)',
    '& svg': {
      color: 'rgb(2, 136, 209)',
    },
    '& .notistack__close svg': {
      color: 'rgb(1, 67, 97)',
    },
  },
  '&.notistack-MuiContent-warning': {
    backgroundColor: 'rgb(255, 244, 229)',
    color: 'rgb(102, 60, 0)',
    '& svg': {
      color: 'rgb(237, 108, 2)',
    },
    '& .notistack__close svg': {
      color: 'rgb(102, 60, 0)',
    },
  },
}));
