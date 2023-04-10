import { Box, styled } from '@mui/material';

export const ButtonWrapper = styled(Box)({
  margin: '10px 0 0',
  textAlign: 'right',
  padding: '0 24px 10px',

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

export const Title = styled(Box)`
  font-weight: 700;
  font-size: 24px;
  line-height: 150%;
  text-align: left;
  color: rgba(0, 0, 0, 0.87);
  padding: 0 50px;
  margin: 0 0 15px;
  @media (min-width: 768px) {
    padding: 0;
    max-width: 576px;
    margin: 0 auto 15px;
  }
`;

export const NumberInput = styled(Box)({
  '& .MuiInputAdornment-positionStart': {
    display: 'none !important',
  },
});
