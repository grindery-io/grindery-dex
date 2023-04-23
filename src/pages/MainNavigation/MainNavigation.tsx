import React from 'react';
import { useNavigate } from 'react-router';
import { Box } from '@mui/system';
import { IconButton, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import {
  CompanyNameWrapper,
  Container,
  LogoWrapper,
  NavTabsWrapper,
  Wrapper,
} from './MainNavigation.style';
import { Logo, NavTabs } from '../../components';
import MainNavigationDrawer from './MainNavigationDrawer';
import MainNavigationUserMenu from './MainNavigationUserMenu';
import {
  useAppSelector,
  selectUserAdvancedMode,
  selectUserAdvancedModeAlert,
} from '../../store';
import { ROUTES } from '../../config';
import { NavTabsItemType } from '../../types';
import MainNavigationSwitchChainButton from './MainNavigationSwitchChainButton';
import MainNavigationWalletBalance from './MainNavigationWalletBalance';
import MainNavigationAdvancedModeAlert from './MainNavigationAdvancedModeAlert';

export const TABS_NAV: NavTabsItemType[] = [
  {
    path: ROUTES.BUY.SHOP.FULL_PATH,
    label: 'Shop',
    icon: <AddShoppingCartIcon />,
    iconPosition: 'start',
  },
  {
    path: ROUTES.BUY.TRADE.FULL_PATH,
    label: 'Trade',
    icon: <CurrencyExchangeIcon />,
    iconPosition: 'start',
  },
];

type Props = {};

const MainNavigation = (props: Props) => {
  let navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const advancedMode = useAppSelector(selectUserAdvancedMode);
  const advancedModeAlert = useAppSelector(selectUserAdvancedModeAlert);

  return (
    <>
      <Container>
        <MainNavigationAdvancedModeAlert />
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
              gap: '8px',
            }}
          >
            <MainNavigationSwitchChainButton />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <MainNavigationWalletBalance />
            </Box>
            <MainNavigationUserMenu />
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
          height: advancedMode && advancedModeAlert ? '123px' : '75px',
        }}
      />
    </>
  );
};

export default MainNavigation;
