import { useState } from 'react';
import Foco from 'react-foco';
import Jdenticon from 'react-jdenticon';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Snackbar } from 'grindery-ui';
import AccountModal from './AccountModal';
import styled from 'styled-components';
import { ICONS } from '../constants';
import useAppContext from '../hooks/useAppContext';

type Props = {
  mode?: 'dark' | 'light';
};

const UserMenu = (props: Props) => {
  const mode = props.mode || 'light';
  const { userEmail } = useAppContext();
  const { address, disconnect } = useGrinderyNexus();
  const [menuOpened, setMenuOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [accountOpened, setAccountOpened] = useState(false);

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
            {userEmail && (
              <button
                onClick={() => {
                  setAccountOpened(true);
                }}
              >
                <img src={ICONS.ACCOUNT} alt="" />
                <span>Account details</span>
              </button>
            )}
            <button
              onClick={() => {
                disconnect();
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
      {userEmail && (
        <AccountModal
          open={accountOpened}
          onClose={() => {
            setAccountOpened(false);
          }}
        />
      )}
    </UserContainer>
  ) : null;
};

export default UserMenu;

const UserContainer = styled.div`
  position: relative;
`;

const UserWrapper = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 34px;
  padding: 7px 12px 7px 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;
  cursor: pointer;

  transition: border-color 0.2s ease-in-out;

  &:hover,
  &.opened {
    border-color: #0b0d17 !important;
  }

  &.dark:hover,
  &.dark.opened {
    border-color: #ffffff !important;
  }
`;

const UserStatus = styled.div`
  background: #f4f5f7;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  box-sizing: border-box;
  padding: 2px;
`;

const UserId = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  margin: 0;
  padding: 0;

  &.dark {
    color: #ffffff;
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  padding-top: 4px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
  transform: translateY(-10px);
  z-index: 99;

  &.opened {
    opacity: 1;
    visibility: visible;
    transform: translateY(0px);
  }
`;

const UserDropdownContent = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  box-shadow: 2px 2px 24px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 10px;

  & button {
    font-family: Roboto;
    background: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    border-radius: 5px;
    border: none;
    gap: 10px;
    cursor: pointer;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;

    img {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background: #fdfbff;
    }

    & span {
      font-weight: 400;
      font-size: 14px;
      line-height: 160%;
      color: #141416;
      white-space: nowrap;
    }
  }
`;
