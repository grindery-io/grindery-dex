import React from 'react';
import { useNavigate } from 'react-router';
import { Box } from '@mui/system';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import {
  CompanyNameWrapper,
  ConnectWrapper,
  LogoWrapper,
  NavTabsWrapper,
  UserWrapper,
  Wrapper,
} from './MainNavigation.style';
import { Logo, NavTabs } from '../../components';
import MainNavigationDrawer from './MainNavigationDrawer';
import MainNavigationUserMenu from './MainNavigationUserMenu';
import { useAppSelector, selectUserId } from '../../store';
import { useUserController } from '../../controllers';
import { ROUTES } from '../../config';
import { NavTabsItemType } from '../../types';

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

  return (
    <>
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

        {!user && 'ethereum' in window && (
          <ConnectWrapper>
            <button
              onClick={() => {
                connectUser();
              }}
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
      </Wrapper>
      <MainNavigationDrawer
        opened={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
      />
    </>
  );
};

export default MainNavigation;
