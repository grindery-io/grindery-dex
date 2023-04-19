import React from 'react';
import { useNavigate } from 'react-router';
import { Box } from '@mui/system';
import { Alert, IconButton, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import {
  CompanyNameWrapper,
  ConnectWrapper,
  Container,
  LogoWrapper,
  NavTabsWrapper,
  UserWrapper,
  Wrapper,
} from './MainNavigation.style';
import { Logo, NavTabs } from '../../components';
import MainNavigationDrawer from './MainNavigationDrawer';
import MainNavigationUserMenu from './MainNavigationUserMenu';
import {
  useAppSelector,
  selectUserId,
  selectUserAdvancedMode,
} from '../../store';
import { useUserController } from '../../controllers';
import { ROUTES } from '../../config';
import { NavTabsItemType } from '../../types';
import MainNavigationChainSelector from './MainNavigationChainSelector';

export const TABS_NAV: NavTabsItemType[] = [
  {
    path: ROUTES.BUY.TRADE.FULL_PATH,
    label: 'Trade',
    icon: <CurrencyExchangeIcon />,
    iconPosition: 'start',
  },
  {
    path: ROUTES.BUY.SHOP.FULL_PATH,
    label: 'Shop',
    icon: <AddShoppingCartIcon />,
    iconPosition: 'start',
  },
];

type Props = {};

const MainNavigation = (props: Props) => {
  let navigate = useNavigate();
  const user = useAppSelector(selectUserId);
  const { connectUser } = useUserController();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const advancedMode = useAppSelector(selectUserAdvancedMode);

  return (
    <>
      <Container>
        {advancedMode && (
          <Alert
            sx={{
              '& .MuiAlert-icon': {
                marginLeft: 'auto',
              },
              '& .MuiAlert-message': {
                marginRight: 'auto',
              },
            }}
            severity="warning"
          >
            Your are in advanced mode. It is safe to use but some information
            and features might not be working yet.
          </Alert>
        )}
        <Wrapper>
          <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
            <IconButton
              aria-label="menu"
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                setDrawerOpen(!drawerOpen);
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <LogoWrapper
            href="/"
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            <Logo variant="square" />
          </LogoWrapper>
          <CompanyNameWrapper
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
            href="/"
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            MERCARI
          </CompanyNameWrapper>

          <NavTabsWrapper>
            <NavTabs menu={TABS_NAV} />
          </NavTabsWrapper>

          <Stack
            ml="auto"
            justifyContent="flex-end"
            flex-wrap="nowrap"
            order="4"
            sx={{
              flexDirection: { xs: 'row', sm: 'row' },
              alignItems: { xs: 'center', sm: 'center' },
              gap: {
                xs: '12px',
                sm: '16px',
              },
            }}
          >
            <MainNavigationChainSelector />
            {!user && 'ethereum' in window && (
              <ConnectWrapper>
                <button
                  onClick={() => {
                    connectUser();
                  }}
                  id="connect-button"
                >
                  Connect wallet
                </button>
              </ConnectWrapper>
            )}
            {user && (
              <UserWrapper>
                <MainNavigationUserMenu />
              </UserWrapper>
            )}
          </Stack>
        </Wrapper>
        <MainNavigationDrawer
          opened={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
          }}
        />
      </Container>
      <Box
        sx={{
          height: advancedMode ? '123px' : '75px',
        }}
      />
    </>
  );
};

export default MainNavigation;
