import React, { useState } from 'react';
import Foco from 'react-foco';
import Jdenticon from 'react-jdenticon';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ICONS, ROUTES } from '../../config';
import { Alert, Snackbar } from '@mui/material';
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
  UserDropdown,
  UserDropdownContent,
  UserId,
  UserStatus,
  UserWrapper,
} from './MainNavigationUserMenu.style';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

type Props = {
  mode?: 'dark' | 'light';
};

const MainNavigationUserMenu = (props: Props) => {
  const mode = props.mode || 'light';
  const { disconnectUser } = useUserController();
  const [menuOpened, setMenuOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  let navigate = useNavigate();
  const isAdmin = useAppSelector(selectUserIsAdmin);
  const address = useAppSelector(selectUserAddress);

  return address ? (
    <UserContainer>
      <Foco
        onClickOutside={() => {
          setMenuOpened(false);
        }}
        onFocusOutside={() => {
          setMenuOpened(false);
        }}
      >
        <UserWrapper
          onClick={() => {
            setMenuOpened(!menuOpened);
          }}
          className={`${menuOpened ? 'opened' : ''} ${mode}`}
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

        <UserDropdown className={menuOpened ? 'opened' : ''}>
          <UserDropdownContent>
            <CopyToClipboard
              text={address}
              onCopy={() => {
                setMenuOpened(false);
                setCopied(true);
              }}
            >
              <button onClick={() => {}}>
                <img src={ICONS.COPY} alt="" />
                <span>{'Copy wallet addres'}</span>
              </button>
            </CopyToClipboard>
            <button
              onClick={() => {
                navigate(ROUTES.HISTORY.ROOT.FULL_PATH);
              }}
            >
              <ReceiptLongIcon sx={{ width: '20px', height: '20px' }} />
              <span>Orders history</span>
            </button>
            <button
              onClick={() => {
                navigate(ROUTES.FAUCET.FULL_PATH);
              }}
            >
              <Icon
                path={mdiWaterPump}
                style={{ width: '20px', height: '20px' }}
              />
              <span>Faucet</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  navigate(ROUTES.SELL.FULL_PATH);
                }}
              >
                <SellOutlinedIcon sx={{ width: '20px', height: '20px' }} />

                <span>Sell</span>
              </button>
            )}
            <button
              onClick={() => {
                disconnectUser();
              }}
              id="disconnect-button"
            >
              <img src={ICONS.DISCONNECT} alt="" />
              <span>Disconnect</span>
            </button>
          </UserDropdownContent>
        </UserDropdown>
      </Foco>
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
