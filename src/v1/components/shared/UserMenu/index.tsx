import {useState} from "react";
import Foco from "react-foco";
import Jdenticon from "react-jdenticon";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {ICONS} from "../../../constants";
import {useGrinderyNexus} from "use-grindery-nexus";
import {Snackbar} from "grindery-ui";
import useAppContext from "../../../hooks/useAppContext";
import AccountModal from "../AccountModal";
import {
  UserContainer,
  UserWrapper,
  UserStatus,
  UserId,
  UserDropdown,
  UserDropdownContent,
} from "./style";

type Props = {
  mode?: "dark" | "light";
};

const UserMenu = (props: Props) => {
  const mode = props.mode || "light";
  const {userEmail} = useAppContext();
  const {address, disconnect} = useGrinderyNexus();
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
          className={`${menuOpened ? "opened" : ""} ${mode}`}
        >
          <UserStatus>
            <Jdenticon size="20" value={encodeURIComponent(address)} />
          </UserStatus>
          <UserId className={mode}>
            {address.substring(0, 6) +
              "..." +
              address.substring(address.length - 4)}
          </UserId>
        </UserWrapper>

        <UserDropdown className={menuOpened ? "opened" : ""}>
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
                <span>{"Copy wallet addres"}</span>
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
