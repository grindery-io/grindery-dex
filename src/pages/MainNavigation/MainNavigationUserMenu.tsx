import React, { useState } from 'react';
import Jdenticon from 'react-jdenticon';
import { ICONS, ROUTES } from '../../config';
import {
  Alert,
  ListItemIcon,
  MenuItem,
  Snackbar,
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
} from '../../store';
import {
  UserContainer,
  UserId,
  UserStatus,
  UserWrapper,
} from './MainNavigationUserMenu.style';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Menu } from '../../components';

type Props = {
  mode?: 'dark' | 'light';
};

const MainNavigationUserMenu = (props: Props) => {
  const mode = props.mode || 'light';
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { disconnectUser } = useUserController();
  const [copied, setCopied] = useState(false);
  let navigate = useNavigate();
  const isAdmin = useAppSelector(selectUserIsAdmin);
  const address = useAppSelector(selectUserAddress);

  const handleClickListItemButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return address ? (
    <UserContainer>
      <UserWrapper
        onClick={handleClickListItemButton}
        className={`${open ? 'opened' : ''} ${mode}`}
        id="user-menu-button"
      >
        <UserStatus>
          <Jdenticon size="20" value={encodeURIComponent(address)} />
        </UserStatus>
        <UserId className={mode} id="user-address">
          {address.substring(0, 6) +
            '...' +
            address.substring(address.length - 4)}
        </UserId>
      </UserWrapper>

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
            <ReceiptLongIcon sx={{ width: '20px', height: '20px' }} />
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
              style={{ width: '20px', height: '20px' }}
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
              <SellOutlinedIcon sx={{ width: '20px', height: '20px' }} />
            </ListItemIcon>
            <Typography component="span" variant="body2">
              Sell
            </Typography>
          </MenuItem>
        )}

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
    </UserContainer>
  ) : null;
};

export default MainNavigationUserMenu;
