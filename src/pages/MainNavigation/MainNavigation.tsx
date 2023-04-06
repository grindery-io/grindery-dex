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
import Logo from '../../components/Logo/Logo';
import NavTabs, { MenuItem } from '../../components/NavTabs/NavTabs';
import UserMenu from '../../components/UserMenu/UserMenu';
import MainNavigationDrawer from './MainNavigationDrawer';
import { useAppSelector } from '../../store/storeHooks';
import { selectUserId } from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';

export const MENU: MenuItem[] = [
  {
    path: '/buy/trade',
    label: 'Trade',
    icon: <CurrencyExchangeIcon />,
    iconPosition: 'start',
  },
  {
    path: '/buy/shop',
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
          <NavTabs menu={MENU} />
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
            <UserMenu />
          </UserWrapper>
        )}
      </Wrapper>
      <MainNavigationDrawer />
    </>
  );
};

export default MainNavigation;
