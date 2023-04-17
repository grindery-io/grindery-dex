import React from 'react';
import {
  BUY_NAVIGATION,
  DRAWER_NAVIGATION,
  FAUCET_MENU,
  ROUTES,
  SELL_NAVIGATION,
} from '../../config';
import { useLocation, useNavigate } from 'react-router';
import { Box } from '@mui/system';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Drawer } from '../../components';
import { useAppSelector, selectUserIsAdmin } from '../../store';
import { SidebarNavigationItemType } from '../../types';

const drawerWidth = 240;

type Props = {
  opened: boolean;
  onClose: () => void;
};

const MainNavigationDrawer = (props: Props) => {
  let navigate = useNavigate();
  const { opened, onClose } = props;
  const isAdmin = useAppSelector(selectUserIsAdmin);
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [faucetOpen, setFaucetOpen] = React.useState(true);
  const [buyOpen, setBuyOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleFaucetClick = () => {
    setFaucetOpen(!faucetOpen);
  };

  const handleBuyClick = () => {
    setBuyOpen(!buyOpen);
  };

  return (
    <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
      <Drawer
        anchor="left"
        open={opened}
        onClose={() => {
          onClose();
        }}
        sx={{
          zIndex: '1301',
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ height: '12px' }} />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {DRAWER_NAVIGATION.filter(
              (link: SidebarNavigationItemType) =>
                isAdmin || link.path === ROUTES.BUY.FULL_PATH
            ).map((link: SidebarNavigationItemType) => (
              <React.Fragment key={link.path}>
                <ListItemButton
                  key={link.path}
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    event.preventDefault();
                    if (link.path === ROUTES.SELL.FULL_PATH) {
                      handleClick();
                    } else if (link.path === ROUTES.FAUCET.FULL_PATH) {
                      handleFaucetClick();
                    } else if (link.path === ROUTES.BUY.FULL_PATH) {
                      handleBuyClick();
                    } else {
                      onClose();
                      navigate(link.path);
                    }
                  }}
                  selected={
                    location.pathname === link.path &&
                    link.path !== ROUTES.FAUCET.FULL_PATH
                  }
                >
                  <ListItemText primary={link.label} />
                  {link.path === ROUTES.BUY.FULL_PATH && (
                    <>{buyOpen ? <ExpandLess /> : <ExpandMore />}</>
                  )}
                  {link.path === ROUTES.SELL.FULL_PATH && (
                    <>{open ? <ExpandLess /> : <ExpandMore />}</>
                  )}
                  {link.path === ROUTES.FAUCET.FULL_PATH && (
                    <>{faucetOpen ? <ExpandLess /> : <ExpandMore />}</>
                  )}
                </ListItemButton>
                {link.path === ROUTES.BUY.FULL_PATH && (
                  <Collapse in={buyOpen} timeout="auto">
                    <List component="div" disablePadding>
                      {BUY_NAVIGATION.map((page: SidebarNavigationItemType) => (
                        <ListItemButton
                          sx={{ pl: 4 }}
                          key={page.path}
                          onClick={(event: React.MouseEvent<HTMLElement>) => {
                            event.preventDefault();
                            onClose();
                            navigate(page.path);
                          }}
                          selected={location.pathname.startsWith(page.path)}
                        >
                          <ListItemText primary={page.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
                {link.path === ROUTES.SELL.FULL_PATH && (
                  <Collapse in={open} timeout="auto">
                    <List component="div" disablePadding>
                      {SELL_NAVIGATION.map(
                        (page: SidebarNavigationItemType) => (
                          <ListItemButton
                            sx={{ pl: 4 }}
                            key={page.path}
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                              event.preventDefault();
                              onClose();
                              navigate(page.path);
                            }}
                            selected={location.pathname.startsWith(page.path)}
                          >
                            <ListItemText primary={page.label} />
                          </ListItemButton>
                        )
                      )}
                    </List>
                  </Collapse>
                )}
                {link.path === ROUTES.FAUCET.FULL_PATH && (
                  <Collapse in={faucetOpen} timeout="auto">
                    <List component="div" disablePadding>
                      {FAUCET_MENU.map((page: any) => (
                        <ListItemButton
                          sx={{ pl: 4 }}
                          key={page.path}
                          onClick={(event: React.MouseEvent<HTMLElement>) => {
                            event.preventDefault();
                            onClose();
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
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MainNavigationDrawer;
