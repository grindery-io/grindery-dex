import React, { useState } from 'react';
import Jdenticon from 'react-jdenticon';
import { ICONS, ROUTES } from '../../config';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import { useUserProvider } from '../../providers';
import {
  useAppSelector,
  selectChainsStore,
  selectUserStore,
} from '../../store';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Menu } from '../../components';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { getChainById, switchMetamaskNetwork } from '../../utils';
import { WalletIcon } from '../../icons';
import { enqueueSnackbar } from 'notistack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LoopIcon from '@mui/icons-material/Loop';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MainNavigationWalletBalance from './MainNavigationWalletBalance';
import { ChainType } from '../../types';
import CheckIcon from '@mui/icons-material/Check';
import MainNavigationTokenBalances from './MainNavigationTokenBalances';

const MODES = {
  DEFAULT: 0,
  CHAINS: 1,
};

type Props = {};

const MainNavigationUserMenuV2 = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mode, setMode] = useState(MODES.DEFAULT);
  const open = Boolean(anchorEl);
  const { disconnectUser, connectUser, handleAdvancedModeToggleAction } =
    useUserProvider();
  let navigate = useNavigate();
  const {
    id: userId,
    accessToken,
    isAdmin,
    address,
    advancedMode,
    chainId: userChainId,
    userTokens,
  } = useAppSelector(selectUserStore);
  const { items: chains } = useAppSelector(selectChainsStore);
  const userChain = getChainById(userChainId, chains);
  const chainsList = chains; //filterBuyerChains(chains);

  const handleClickListItemButton = (event: React.MouseEvent<HTMLElement>) => {
    if (accessToken) {
      setAnchorEl(event.currentTarget);
    } else {
      connectUser();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setTimeout(() => {
      setMode(MODES.DEFAULT);
    }, 800);
  };

  const handleNetworkClick = async (
    event: React.MouseEvent<HTMLElement>,
    chain: ChainType,
    userChainId: string
  ) => {
    setAnchorEl(null);
    setTimeout(() => {
      setMode(MODES.DEFAULT);
    }, 800);
    try {
      await switchMetamaskNetwork(userChainId, chain);
    } catch (error) {
      console.error('switchMetamaskNetwork error: ', error);
    }
  };

  return (
    <Box>
      <List
        component="nav"
        aria-label="wallet"
        sx={{
          bgcolor: 'transparent',
          padding: '0',
          '& .MuiListItemSecondaryAction-root': {
            height: '20px',
            width: '20px',
            right: '8px',
          },
        }}
      >
        <ListItem disablePadding>
          <ListItemButton
            id={accessToken ? 'user-menu-button' : 'connect-button'}
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItemButton}
            //onMouseOver={handleClickListItemButton}
            component="button"
            sx={{
              borderRadius: '8px',
              paddingTop: '7px',
              paddingBottom: '7px',
              paddingLeft: '16px',
              paddingRight: '16px',
              transition: 'border-color 0.2s ease-in-out',
              border: `1px solid ${open ? '#0B0C0E' : 'transparent'}`,
              '&:hover': {
                background: 'transparent',
                borderColor: '#0B0C0E !important',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 'auto',
                padding: accessToken ? '0px' : '4px',
                marginRight: userChain ? '16px' : '0',
                '& img': {
                  width: '32px',
                  height: '32px',
                  maxWidth: '32px',
                  display: 'block',
                },
              }}
            >
              {accessToken ? (
                <MainNavigationWalletBalance />
              ) : (
                <WalletIcon sx={{ color: '#0B0D17', marginRight: '8px' }} />
              )}
            </ListItemIcon>

            <ListItemText
              secondaryTypographyProps={{
                component: 'div',
              }}
              sx={{
                margin: 0,
                '& .MuiListItemText-secondary': {
                  lineHeight: 1.2,
                  color: '#000',
                  marginTop: '2px',
                  fontSize: '0.75rem',
                },
              }}
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.75rem',
                    lineHeight: 1.2,
                    color: '#0B0D17',
                  }}
                >
                  {userChainId
                    ? `MetaMask @ ${userChain ? userChain.label : 'Unknown'}`
                    : 'Not Connected'}
                </Typography>
              }
              secondary={
                <Stack direction="row" alignItems="center" gap="4px">
                  {accessToken ? (
                    <>
                      <Box
                        sx={{
                          display: 'block',
                          borderRadius: '50%',
                          width: '12px',
                          height: '12px',
                          overflow: 'hidden',
                          background: '#F4F5F7',
                        }}
                      >
                        <Jdenticon
                          size="12"
                          value={encodeURIComponent(address)}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          fontSize: 'inherit',
                          color: '#0B0D17',
                          fontWeight: '700',
                          lineHeight: 1,
                        }}
                        id="user-address"
                      >
                        {address.substring(0, 6) +
                          '...' +
                          address.substring(address.length - 4)}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        fontSize: 'inherit',
                        color: '#EA5230',
                        fontWeight: '700',
                        lineHeight: 'inherit',
                      }}
                    >
                      Connect Wallet
                    </Typography>
                  )}
                </Stack>
              }
            />
            {accessToken && (
              <ListItemIcon
                sx={{
                  minWidth: 'initial',
                  marginLeft: '8px',
                  marginRight: '-10px',
                }}
              >
                <ArrowDropDownIcon />
              </ListItemIcon>
            )}
          </ListItemButton>
        </ListItem>
      </List>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiMenu-list': {
            padding: mode === MODES.CHAINS ? '8px' : '24px',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            transition:
              'all 276ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 184ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important',
          },
        }}
      >
        {mode === MODES.DEFAULT && (
          <ListItem disablePadding disabled sx={{ opacity: '1 !important' }}>
            <ListItemIcon
              sx={{
                minWidth: 'auto',
                padding: '0px',
                marginRight: '8px',
                '& img': {
                  width: '48px !important',
                  height: '48px !important',
                  maxWidth: '48px !important',
                  display: 'block',
                },
              }}
            >
              <img src={ICONS.METAMASK} alt="" />
            </ListItemIcon>

            <ListItemText
              secondaryTypographyProps={{
                component: 'div',
              }}
              sx={{
                margin: 0,
              }}
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '16px',
                    lineHeight: '19px',
                    color: '#0B0D17',
                    fontWeight: '700',
                  }}
                >
                  MetaMask
                </Typography>
              }
              secondary={
                <Stack sx={{ marginTop: '4px' }} direction="row">
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      fontSize: '14px',
                      color: '#979797',
                      fontWeight: '400',
                      lineHeight: '125%',
                    }}
                  >
                    {address.substring(0, 6) +
                      '...' +
                      address.substring(address.length - 4)}
                  </Typography>
                  <Tooltip title="Copy wallet address">
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(address);
                        enqueueSnackbar(`Wallet address copied!`, {
                          variant: 'success',
                        });
                      }}
                      sx={{ marginLeft: '4px', padding: '1px !important' }}
                    >
                      <ContentCopyIcon sx={{ fontSize: '14px' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <ListItemIcon
              sx={{
                minWidth: 'initial',
                marginLeft: '20px',
                marginBottom: 'auto',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                  background: '#FFFFFF',
                  border: '1px solid #D4D7DD',
                  borderRadius: '4px',
                  padding: '4px 8px',
                }}
              >
                {userChain && (
                  <Avatar
                    src={userChain?.icon}
                    sx={{
                      width: '12px',
                      height: '12px',
                      marginRight: '4px',
                      '& img': {
                        width: '100% !important',
                        height: '100% !important',
                      },
                    }}
                  />
                )}
                <Typography
                  sx={{
                    fontWeight: '400',
                    fontSize: '12px',
                    lineHeight: '120%',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {userChain?.label || 'Unknown network'}
                </Typography>
              </Stack>
            </ListItemIcon>
          </ListItem>
        )}
        {mode === MODES.DEFAULT && (
          <Box
            sx={{ margin: '16px 0', height: '1px', background: '#E3E3E8' }}
          />
        )}
        {mode === MODES.DEFAULT && userChain && userTokens.length > 0 && (
          <MainNavigationTokenBalances />
        )}
        {mode === MODES.DEFAULT && userChain && userTokens.length > 0 && (
          <Box
            sx={{ margin: '16px 0', height: '1px', background: '#E3E3E8' }}
          />
        )}
        {mode === MODES.DEFAULT && (
          <MenuItem
            onClick={() => {
              setMode(MODES.CHAINS);
            }}
          >
            <ListItemIcon>
              <LoopIcon sx={{ width: '20px', height: '20px', color: '#000' }} />
            </ListItemIcon>
            <Typography component="span" variant="body2">
              Change network
            </Typography>
          </MenuItem>
        )}

        {advancedMode && mode === MODES.DEFAULT && (
          <MenuItem
            onClick={() => {
              handleClose();
              navigate(ROUTES.HISTORY.ROOT.FULL_PATH);
            }}
          >
            <ListItemIcon>
              <ReceiptLongIcon
                sx={{ width: '20px', height: '20px', color: '#000' }}
              />
            </ListItemIcon>
            <Typography component="span" variant="body2">
              Orders history
            </Typography>
          </MenuItem>
        )}

        {isAdmin && mode === MODES.DEFAULT && (
          <MenuItem
            onClick={() => {
              handleClose();
              navigate(ROUTES.SELL.FULL_PATH);
            }}
          >
            <ListItemIcon>
              <SellOutlinedIcon
                sx={{ width: '20px', height: '20px', color: '#000' }}
              />
            </ListItemIcon>
            <Typography component="span" variant="body2">
              Sell
            </Typography>
          </MenuItem>
        )}
        {mode === MODES.DEFAULT && (
          <MenuItem disableRipple>
            <ListItemIcon>
              <SettingsOutlinedIcon sx={{ color: '#000' }} />
            </ListItemIcon>
            <Stack
              direction="row"
              flexWrap="nowrap"
              alignItems="center"
              justifyContent="space-between"
              gap="8px"
              sx={{ flex: 1 }}
            >
              <Typography component="span" variant="body2">
                Advanced mode
              </Typography>
              <Switch
                checked={advancedMode}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleAdvancedModeToggleAction(userId, event.target.checked);
                }}
                color="success"
                sx={{
                  marginRight: '-12px',
                  marginTop: '-12px',
                  marginBottom: '-12px',
                  '& .MuiSwitch-switchBase': {
                    '&:hover': {
                      background: 'transparent !important',
                    },
                  },
                }}
              />
            </Stack>
          </MenuItem>
        )}
        {mode === MODES.DEFAULT && (
          <Button
            onClick={() => {
              handleClose();
              disconnectUser();
            }}
            id="disconnect-button"
            startIcon={<img src={ICONS.DISCONNECT} alt="" />}
            sx={{
              width: '100%',
              background: '#F1F2F4',
              borderRadius: '5px',
              color: '#0B0C0E',
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '1.5',
              padding: '12px 24px !important',
              margin: '16px 0 0',
              '&:hover': {
                background: '#F1F2F4 !important',
                color: '#0B0C0E !important',
              },
              '& .MuiButton-startIcon img': {
                padding: 0,
                border: 'none',
                background: 'none',
              },
            }}
          >
            Disconnect
          </Button>
        )}

        {mode === MODES.CHAINS && (
          <Button
            onClick={() => {
              setMode(MODES.DEFAULT);
            }}
            sx={{
              background: '#FFFFFF',
              border: '1px solid #B9BDC6',
              borderRadius: '5px',
              fontWeight: '700',
              fontSize: '12px',
              lineHeight: '160%',
              padding: '8px 24px',
              color: '#0B0D17',
              width: '100%',
              margin: '0 0 6px',
              '&:hover': {
                background: '#FFFFFF !important',
                color: '#0B0D17 !important',
              },
            }}
            startIcon={<ArrowBackIcon sx={{ fontSize: '16px !important' }} />}
          >
            Back to wallet
          </Button>
        )}
        {mode === MODES.CHAINS &&
          chainsList.map((chain: ChainType) => (
            <MenuItem
              key={chain.chainId}
              onClick={(event) => {
                if (chain.chainId !== userChainId) {
                  handleNetworkClick(event, chain, userChainId);
                } else {
                  handleClose();
                }
              }}
              id={`chain-${chain.chainId}`}
              sx={{
                padding: '8px 16px !important',
                borderRadius: '34px !important',
                '&:hover': {
                  background: '#F1F2F4 !important',
                },
              }}
            >
              <ListItemIcon>
                <img src={chain.icon} alt="" />
              </ListItemIcon>
              <Typography component="span" variant="body2">
                {chain.label}
              </Typography>
              {chain.chainId === userChainId && (
                <ListItemIcon sx={{ marginLeft: 'auto', marginRight: '-8px' }}>
                  <CheckIcon sx={{ marginLeft: '8px', fontSize: '20px' }} />
                </ListItemIcon>
              )}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};

export default MainNavigationUserMenuV2;
