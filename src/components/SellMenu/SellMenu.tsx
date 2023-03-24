import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sellPages } from '../../pages/SellPage/SellPage';

type Props = {};

const drawerWidth = 240;

const SellMenu = (props: Props) => {
  let navigate = useNavigate();
  const location = useLocation();
  return (
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
      <Drawer
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
            {sellPages.map((page: any) => (
              <ListItem key={page.path} disablePadding>
                <ListItemButton
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    event.preventDefault();
                    navigate(page.fullPath);
                  }}
                  selected={location.pathname.startsWith(page.fullPath)}
                >
                  <ListItemText primary={page.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SellMenu;
