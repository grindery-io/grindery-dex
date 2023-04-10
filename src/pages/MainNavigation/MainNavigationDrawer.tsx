import React from 'react';
import { FAUCET_MENU } from '../../config/constants';
import { useLocation, useNavigate } from 'react-router';
import { Box } from '@mui/system';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { sellPages } from '../SellPage/SellPage';
import { buyPages } from '../BuyPage/BuyPage';
import Drawer from '../../components/Drawer/Drawer';
import { useAppSelector, selectUserIsAdmin } from '../../store';

const drawerWidth = 240;

type Props = {
  opened: boolean;
  onClose: () => void;
  nav: object[];
};

const MainNavigationDrawer = (props: Props) => {
  let navigate = useNavigate();
  const { opened, onClose, nav } = props;
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
            {nav
              .filter((link: any) => isAdmin || link.path === '/buy')
              .map((link: any) => (
                <React.Fragment key={link.path}>
                  <ListItemButton
                    key={link.path}
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                      event.preventDefault();
                      if (link.path === '/sell') {
                        handleClick();
                      } else if (link.path === '/faucet') {
                        handleFaucetClick();
                      } else if (link.path === '/buy') {
                        handleBuyClick();
                      } else {
                        onClose();
                        navigate(link.path);
                      }
                    }}
                    selected={
                      location.pathname === link.path && link.path !== '/faucet'
                    }
                  >
                    <ListItemText primary={link.label} />
                    {link.path === '/buy' && (
                      <>{buyOpen ? <ExpandLess /> : <ExpandMore />}</>
                    )}
                    {link.path === '/sell' && (
                      <>{open ? <ExpandLess /> : <ExpandMore />}</>
                    )}
                    {link.path === '/faucet' && (
                      <>{faucetOpen ? <ExpandLess /> : <ExpandMore />}</>
                    )}
                  </ListItemButton>
                  {link.path === '/buy' && (
                    <Collapse in={buyOpen} timeout="auto">
                      <List component="div" disablePadding>
                        {buyPages.map((page: any) => (
                          <ListItemButton
                            sx={{ pl: 4 }}
                            key={page.path}
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                              event.preventDefault();
                              onClose();
                              navigate(page.fullPath);
                            }}
                            selected={location.pathname.startsWith(
                              page.fullPath
                            )}
                          >
                            <ListItemText primary={page.label} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                  {link.path === '/sell' && (
                    <Collapse in={open} timeout="auto">
                      <List component="div" disablePadding>
                        {sellPages.map((page: any) => (
                          <ListItemButton
                            sx={{ pl: 4 }}
                            key={page.path}
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                              event.preventDefault();
                              onClose();
                              navigate(page.fullPath);
                            }}
                            selected={location.pathname.startsWith(
                              page.fullPath
                            )}
                          >
                            <ListItemText primary={page.label} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                  {link.path === '/faucet' && (
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
                            selected={location.pathname.startsWith(
                              page.fullPath
                            )}
                          >
                            <ListItemText primary={page.label} />
                            {page.external && (
                              <OpenInNewIcon fontSize="small" />
                            )}
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
