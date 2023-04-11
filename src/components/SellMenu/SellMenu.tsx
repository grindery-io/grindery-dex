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
import DrawerDesktop from '../Drawer/DrawerDesktop';
import { SELL_NAVIGATION } from '../../config';
import { SidebarNavigationItemType } from '../../types';

type Props = {};

const drawerWidth = 240;

const SellMenu = (props: Props) => {
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
              <ListSubheader component="div" id="sell-list-subheader">
                Sell
              </ListSubheader>
            }
          >
            {SELL_NAVIGATION.map((page: SidebarNavigationItemType) => (
              <ListItem key={page.path} disablePadding>
                <ListItemButton
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    event.preventDefault();
                    navigate(page.path);
                  }}
                  selected={location.pathname.startsWith(page.path)}
                >
                  <ListItemText primary={page.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </DrawerDesktop>
    </Box>
  );
};

export default SellMenu;
