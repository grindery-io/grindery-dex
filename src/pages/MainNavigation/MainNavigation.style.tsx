import { styled } from '@mui/material';

export const Container = styled('div')({
  position: 'fixed',
  left: '0',
  top: '0',
  zIndex: '1300',
  width: '100%',
  maxWidth: '100%',
});

export const Wrapper = styled('div')({
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: '10px',
  backdropFilter: 'blur(12px)',
  background: 'rgba(255, 255, 255, 0.84)',
  width: '100%',
  boxSizing: 'border-box',
});

export const UserWrapper = styled('div')({
  order: '4',
  '@media (min-width: 960px)': {
    order: '4',
  },
});

export const LogoWrapper = styled('a')({
  display: 'block',
  textDecoration: 'none',
  '@media (min-width: 960px)': {
    order: '2',
  },
});

export const CompanyNameWrapper = styled('a')({
  order: '3',
  fontWeight: '700',
  fontSize: '16px',
  lineHeight: '110%',
  color: '#0b0d17',
  cursor: 'pointer',
  textDecoration: 'none',
});

export const NavTabsWrapper = styled('div')({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: '24px',
  order: '3',
  '@media (max-width: 1199px)': {
    display: 'none',
  },
});

export const ConnectWrapper = styled('div')({
  display: 'block',
  order: 4,
  '& button': {
    background: '#0b0d17',
    borderRadius: '5px',
    boxShadow: 'none',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '150%',
    color: '#ffffff',
    padding: '8px 24px',
    cursor: 'pointer',
    border: 'none',
    '&:hover': {
      boxShadow: '0px 4px 8px rgba(106, 71, 147, 0.1)',
    },
  },
});
