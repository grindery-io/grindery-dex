import React, { useState } from 'react';
import Jdenticon from 'react-jdenticon';
import { ICONS, ROUTES } from '../../config';
import {
  Alert,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Snackbar,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiWaterPump } from '@mdi/js';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import { useUserController } from '../../controllers';
import {
  useAppSelector,
  selectUserAddress,
  selectUserIsAdmin,
  selectUserAdvancedMode,
  selectUserId,
  selectChainsItems,
  selectUserChainId,
  selectUserAccessToken,
} from '../../store';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Menu } from '../../components';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { getChainById } from '../../utils';
import { WalletIcon } from '../../icons';

type Props = {};

const MainNavigationUserMenu = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { disconnectUser, connectUser, handleAdvancedModeToggleAction } =
    useUserController();
  const [copied, setCopied] = useState(false);
  let navigate = useNavigate();
  const userId = useAppSelector(selectUserId);
  const accessToken = useAppSelector(selectUserAccessToken);
  const isAdmin = useAppSelector(selectUserIsAdmin);
  const address = useAppSelector(selectUserAddress);
  const advancedMode = useAppSelector(selectUserAdvancedMode);
  const userChainId = useAppSelector(selectUserChainId);
  const chains = useAppSelector(selectChainsItems);
  const goerliChain = getChainById('5', chains);

  const handleClickListItemButton = (event: React.MouseEvent<HTMLElement>) => {
    if (accessToken) {
      setAnchorEl(event.currentTarget);
    } else {
      connectUser();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            component="button"
            sx={{
              borderRadius: '34px',
              paddingTop: '7px',
              paddingBottom: '7px',
              paddingLeft: '16px',
              paddingRight: '16px',
              transition: 'border-color 0.2s ease-in-out',
              border: `1px solid ${open ? '#0b0d17' : '#dcdcdc'}`,
              '&:hover': {
                background: 'transparent',
                borderColor: '#0b0d17 !important',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 'auto',
                padding: accessToken ? '0px' : '4px',
                marginRight: '8px',
                '& img': {
                  width: '32px',
                  height: '32px',
                  maxWidth: '32px',
                  display: 'block',
                },
              }}
            >
              {accessToken ? (
                <img src={ICONS.METAMASK} alt="" />
              ) : (
                <WalletIcon sx={{ color: '#0B0D17' }} />
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
                    ? `MetaMask @ ${
                        goerliChain && userChainId === '5'
                          ? goerliChain.label
                          : 'Unknown'
                      }`
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
          </ListItemButton>
        </ListItem>
      </List>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            navigator.clipboard.writeText(address);
            setCopied(true);
          }}
        >
          <ListItemIcon>
            <img src={ICONS.COPY} alt="" />
          </ListItemIcon>
          <Typography component="span" variant="body2">
            Copy wallet address
          </Typography>
        </MenuItem>
        {isAdmin && (
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
        <MenuItem
          onClick={() => {
            handleClose();
            navigate(ROUTES.FAUCET.FULL_PATH);
          }}
        >
          <ListItemIcon>
            <Icon
              path={mdiWaterPump}
              style={{ width: '20px', height: '20px', color: '#000' }}
            />
          </ListItemIcon>
          <Typography component="span" variant="body2">
            Faucet
          </Typography>
        </MenuItem>
        {isAdmin && (
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
        <MenuItem
          onClick={() => {
            handleClose();
            disconnectUser();
          }}
          component="button"
          id="disconnect-button"
          sx={{ width: '100%' }}
        >
          <ListItemIcon>
            <img src={ICONS.DISCONNECT} alt="" />
          </ListItemIcon>
          <Typography component="span" variant="body2">
            Disconnect
          </Typography>
        </MenuItem>
      </Menu>

      <Snackbar
        open={copied}
        onClose={() => {
          setCopied(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={2000}
      >
        <Alert severity="success">Wallet address copied!</Alert>
      </Snackbar>
    </Box>
  );
};

export default MainNavigationUserMenu;
