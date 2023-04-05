import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DrawerDesktop from '../Drawer/DrawerDesktop';

export const FAUCET_MENU = [
  // {
  //   path: '/',
  //   fullPath: '/faucet',
  //   label: 'GRT Tokens',
  //   external: false,
  // },
  {
    path: 'https://goerlifaucet.com/',
    fullPath: 'https://goerlifaucet.com/',
    label: 'Goerli ETH Tokens',
    external: true,
  },
  // {
  //   path: 'https://testnet.bnbchain.org/faucet-smart',
  //   fullPath: 'https://testnet.bnbchain.org/faucet-smart',
  //   label: 'Binance BNB Tokens',
  //   external: true,
  // },
  // {
  //   path: 'https://cronos.org/faucet',
  //   fullPath: 'https://cronos.org/faucet',
  //   label: 'Cronos CRO Tokens',
  //   external: true,
  // },
];

type Props = {};

const drawerWidth = 240;

const FaucetMenu = (props: Props) => {
  let navigate = useNavigate();
  const location = useLocation();
  return (
    <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
      <DrawerDesktop
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ height: '73px' }} />
        <Box sx={{ overflow: 'auto' }}>
          <List
            subheader={
              <ListSubheader component="div" id="faucet-list-subheader">
                Faucet
              </ListSubheader>
            }
          >
            {FAUCET_MENU.map((page: any) => (
              <ListItem key={page.path} disablePadding>
                <ListItemButton
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    event.preventDefault();
                    if (page.external) {
                      window.open(page.fullPath, '_blank');
                    } else {
                      navigate(page.fullPath);
                    }
                  }}
                  selected={location.pathname.startsWith(page.fullPath)}
                >
                  <ListItemText primary={page.label} />
                  {page.external && <OpenInNewIcon fontSize="small" />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </DrawerDesktop>
    </Box>
  );
};

export default FaucetMenu;
