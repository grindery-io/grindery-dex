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
import LockIcon from '@mui/icons-material/Lock';

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
            id="user-menu-button"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItemButton}
            sx={{
              borderRadius: '34px',
              paddingTop: '3px',
              paddingBottom: '3px',
              paddingLeft: '8px',
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
                minWidth: '36px',
                '& img': {
                  width: '28px',
                  height: '28px',
                  maxWidth: '28px',
                  display: 'block',
                },
              }}
            >
              {accessToken ? <img src={ICONS.METAMASK} alt="" /> : <LockIcon />}
            </ListItemIcon>

            <ListItemText
              sx={{
                margin: 0,
                '& .MuiListItemText-secondary': {
                  lineHeight: 1,
                  color: '#000',
                },
              }}
              primary={
                <Typography variant="body2">
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
                <Stack direction="row" alignItems="center" gap="8px">
                  {accessToken ? (
                    <>
                      <Box
                        sx={{
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          overflow: 'hidden',
                        }}
                      >
                        <Jdenticon
                          size="16"
                          value={encodeURIComponent(address)}
                        />
                      </Box>
                      <Typography variant="body2">
                        {address.substring(0, 6) +
                          '...' +
                          address.substring(address.length - 4)}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2">Connect Wallet</Typography>
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
          id="disconnect-button"
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
