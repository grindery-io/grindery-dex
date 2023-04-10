import { Box, styled } from '@mui/material';

export const StakeBadge = styled(Box)({
  backgroundColor: 'rgb(245, 181, 255)',
  border: '1px solid rgb(245, 181, 255)',
  borderRadius: '8px',
  color: 'rgb(0, 0, 0)',
  padding: '6px',
  fontSize: '12px',
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
