import React from 'react';
import styled from 'styled-components';
import useAppContext from '../../hooks/useAppContext';
import Logo from '../Logo/Logo';
import { FAUCET_MENU, SCREEN } from '../../constants';
import UserMenu from '../UserMenu/UserMenu';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { useLocation, useNavigate } from 'react-router';
import { Box } from '@mui/system';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useAdmin from '../../hooks/useAdmin';
import { sellPages } from '../../pages/SellPage/SellPage';

const menu = [
  {
    path: '/buy',
    label: 'Buy',
  },
  {
    path: '/sell',
    label: 'Sell',
  },
  {
    path: '/faucet',
    label: 'Faucet',
  },
];

const Wrapper = styled.div`
  border-bottom: 1px solid #dcdcdc;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 10px;
  position: fixed;
  left: 0;
  top: 0;
  background: #ffffff;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  z-index: 1300;
  @media (min-width: ${SCREEN.TABLET}) {
    width: 100%;
    top: 0;
    max-width: 100%;
  }
`;

const UserWrapper = styled.div`
  margin-left: auto;
  order: 4;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 4;
  }
`;

const LogoWrapper = styled.a`
  display: block;
  text-decoration: none;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 2;
  }
`;

const CompanyNameWrapper = styled.a`
  display: block;
  order: 3;
  font-weight: 700;
  font-size: 16px;
  line-height: 110%;
  color: #0b0d17;
  cursor: pointer;
  text-decoration: none;
`;

const LinksWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 24px;
  order: 3;

  @media (max-width: 899px) {
    display: none;
  }

  & a {
    font-size: 16px;
    line-height: 150%;
    text-decoration: none;
    display: inline-block;
    color: #0b0d17;
    cursor: pointer;
    text-transform: uppercase;
    font-weight: 500;

    &.active {
      font-weight: 700;
    }
  }
`;

const ConnectWrapper = styled.div`
  display: none;
  margin-left: auto;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 4;
    display: block;
    margin-left: auto;

    & button {
      background: #0b0d17;
      border-radius: 5px;
      box-shadow: none;
      font-weight: 700;
      font-size: 16px;
      line-height: 150%;
      color: #ffffff;
      padding: 8px 24px;
      cursor: pointer;
      border: none;

      &:hover {
        box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
      }
    }
  }
`;

const drawerWidth = 240;

type Props = {};

const AppHeader = (props: Props) => {
  let navigate = useNavigate();
  const { user } = useAppContext();
  const { isLoading, isAdmin } = useAdmin();
  const { connect } = useGrinderyNexus();
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [faucetOpen, setFaucetOpen] = React.useState(true);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleFaucetClick = () => {
    setFaucetOpen(!faucetOpen);
  };

  return (
    <>
      <Wrapper>
        {isAdmin && (
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              aria-label="menu"
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                setDrawerOpen(!drawerOpen);
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

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
          DELIGHT
        </CompanyNameWrapper>

        {isAdmin && (
          <LinksWrapper>
            {menu.map((link: any) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.preventDefault();
                  navigate(link.path);
                }}
                className={
                  location.pathname.startsWith(link.path) ? 'active' : 'default'
                }
              >
                {link.label}
              </a>
            ))}
          </LinksWrapper>
        )}
        {!user && 'ethereum' in window && (
          <ConnectWrapper>
            <button
              onClick={() => {
                connect();
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
      {isAdmin && (
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Drawer
            variant="persistent"
            anchor="left"
            open={drawerOpen}
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
              <List>
                {menu.map((link: any) => (
                  <React.Fragment key={link.path}>
                    <ListItemButton
                      key={link.path}
                      onClick={(event: React.MouseEvent<HTMLElement>) => {
                        event.preventDefault();
                        if (link.path === '/sell') {
                          handleClick();
                        } else if (link.path === '/faucet') {
                          handleFaucetClick();
                        } else {
                          setDrawerOpen(false);
                          navigate(link.path);
                        }
                      }}
                      selected={
                        location.pathname == link.path &&
                        link.path !== '/faucet'
                      }
                    >
                      <ListItemText primary={link.label} />
                      {link.path === '/sell' && (
                        <>{open ? <ExpandLess /> : <ExpandMore />}</>
                      )}
                      {link.path === '/faucet' && (
                        <>{faucetOpen ? <ExpandLess /> : <ExpandMore />}</>
                      )}
                    </ListItemButton>
                    {link.path === '/sell' && (
                      <Collapse in={open} timeout="auto">
                        <List component="div" disablePadding>
                          {sellPages.map((page: any) => (
                            <ListItemButton
                              sx={{ pl: 4 }}
                              key={page.path}
                              onClick={(
                                event: React.MouseEvent<HTMLElement>
                              ) => {
                                event.preventDefault();
                                setDrawerOpen(false);
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
                              onClick={(
                                event: React.MouseEvent<HTMLElement>
                              ) => {
                                event.preventDefault();
                                setDrawerOpen(false);
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
      )}
    </>
  );
};

export default AppHeader;
