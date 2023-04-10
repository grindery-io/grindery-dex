import React, { useState } from 'react';
import { ThemeProvider as GrinderyThemeProvider } from 'grindery-ui';
import Foco from 'react-foco';
import Jdenticon from 'react-jdenticon';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ICONS } from '../../config/constants';
import { Snackbar } from 'grindery-ui';
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
    <GrinderyThemeProvider>
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
          >
            <UserStatus>
              <Jdenticon size="20" value={encodeURIComponent(address)} />
            </UserStatus>
            <UserId className={mode}>
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
                  navigate('/faucet');
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
                    navigate('/sell');
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
              >
                <img src={ICONS.DISCONNECT} alt="" />
                <span>Disconnect</span>
              </button>
            </UserDropdownContent>
          </UserDropdown>
        </Foco>
        <Snackbar
          open={copied}
          handleClose={() => {
            setCopied(false);
          }}
          message="Wallet address copied!"
          hideCloseButton
          autoHideDuration={2000}
          severity="success"
        />
      </UserContainer>
    </GrinderyThemeProvider>
  ) : null;
};

export default MainNavigationUserMenu;
