import { styled } from '@mui/material';

export const ButtonWrapper = styled('div')({
  margin: '10px 0 0',
  textAlign: 'right',
  '& button': {
    backgroundColor: '#3f49e1',
    fontWeight: 400,
    borderRadius: 8,
    '&:hover': {
      backgroundColor: 'rgb(50, 58, 180)',
      opacity: 1,
      boxShadow: 'none',
    },
  },
});

export const Title = styled('p')({
  fontWeight: 700,
  fontSize: 24,
  lineHeight: '150%',
  textAlign: 'left',
  color: 'rgba(0, 0, 0, 0.87)',
  padding: '0 50px',
  margin: '0 0 15px',
  '@media (min-width: 768px)': {
    padding: 0,
    maxWidth: 576,
    margin: '0 auto 15px',
  },
});

export const NumberInput = styled('div')({
  '& .MuiInputAdornment-positionStart': {
    display: 'none !important',
  },
});

export const TextBadge = styled('p')({
  backgroundColor: 'rgb(245, 181, 255)',
  border: '1px solid rgb(245, 181, 255)',
  borderRadius: 8,
  color: 'rgb(0, 0, 0)',
  padding: 6,
  fontSize: 12,
  lineHeight: 1,
  fontWeight: 600,
  height: 'auto',
  letterSpacing: '0.05rem',
  textTransform: 'uppercase',
  display: 'inline-block',
  margin: '12px 0px 0 16px',
  '&.secondary': {
    backgroundColor: 'transparent',
    border: '1px solid rgb(224, 224, 224)',
    color: 'rgb(116, 116, 116)',
  },
});
