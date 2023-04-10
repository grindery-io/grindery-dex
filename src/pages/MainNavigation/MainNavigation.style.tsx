import { styled } from '@mui/material';

export const Wrapper = styled('div')({
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: '10px',
  position: 'fixed',
  left: '0',
  top: '0',
  backdropFilter: 'blur(12px)',
  background: 'rgba(255, 255, 255, 0.84)',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  zIndex: '1300',
  '@media (min-width: 960px)': {
    width: '100%',
    top: '0',
    maxWidth: '100%',
  },
});

export const UserWrapper = styled('div')({
  marginLeft: 'auto',
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
  display: 'block',
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
  display: 'none',
  marginLeft: 'auto',
  '@media (min-width: 960px)': {
    order: '4',
    display: 'block',
    marginLeft: 'auto',
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
  },
});
