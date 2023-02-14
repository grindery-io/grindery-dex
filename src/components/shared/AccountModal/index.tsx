import React, {useEffect, useState} from "react";
import {Snackbar, Dialog} from "grindery-ui";
import {ICONS} from "../../../constants";
import {useGrinderyNexus} from "use-grindery-nexus";
import useAppContext from "../../../hooks/useAppContext";
import {
  Container,
  CloseButton,
  InputWrapper,
  Input,
  DeleteAccountButton,
  SaveButton,
  BackButton,
  ButtonsWrapper,
  CancelButton,
  ConfirmDeleteButton,
  ErrorMessage,
  Title,
  Text,
} from "./style";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AccountModal = (props: Props) => {
  const {address} = useGrinderyNexus();
  const {client, disconnect, userEmail, setUserEmail} = useAppContext();
  const {open, onClose} = props;
  const [view, setView] = useState("account_edit");
  const [email, setEmail] = useState(userEmail || "");
  const [wallet, setWallet] = useState("");
  const [snackbar, setSnackbar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setView("account_edit");
      setWallet("");
      setEmail(userEmail);
    }, 500);
  };

  const handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handleWalletChange = (event: React.FormEvent<HTMLInputElement>) => {
    setWallet(event.currentTarget.value);
  };

  const handleDeleteAccountButtonClick = () => {
    setView("account_delete");
  };

  const handleBackButtonClick = () => {
    setView("account_edit");
    setWallet("");
  };

  const handleCancelButtonClick = () => {
    setView("account_edit");
    setWallet("");
  };

  const handleConfirmDeleteClick = async () => {
    setLoading(true);
    let res;
    try {
      res = await client?.deleteUser();
    } catch (error: any) {
      setError(
        error?.message ||
          "Server error, account wasn't deleted. Please, try again later."
      );
      setLoading(false);
      return;
    }
    if (res) {
      handleClose();
      setSnackbar("Your account was successfully deleted.");
      setError("");
      setTimeout(() => {
        disconnect();
        window.location.reload();
      }, 1500);
    } else {
      setSnackbar("");
      setError(
        "Server error, account wasn't deleted. Please, try again later."
      );
    }
    setLoading(false);
  };

  const handleSaveButtonClick = async () => {
    setLoading(true);
    let res;
    try {
      res = await client?.updateUserEmail(email);
    } catch (error: any) {
      setError(
        error?.message ||
          "Server error, email wasn't updated. Please, try again later."
      );
      setLoading(false);
      return;
    }
    if (res) {
      handleClose();
      setSnackbar("Email updated");
      setError("");
      const newEmail = await client?.getUserEmail().catch((error) => {
        console.error("getUserEmail error", error.message || "Server error");
      });
      setUserEmail(newEmail || "");
    } else {
      setSnackbar("");
      setError("Server error, email wasn't updated. Please, try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    setEmail(userEmail || "");
  }, [userEmail]);

  return userEmail ? (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="604px">
        <Container>
          <CloseButton onClick={handleClose}>
            <img src={ICONS.CROSS} alt="close account details" />
          </CloseButton>
          {view && view === "account_edit" && (
            <>
              <Title>Account details</Title>
              <InputWrapper>
                <span>Email</span>
                <Input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </InputWrapper>
              <DeleteAccountButton onClick={handleDeleteAccountButtonClick}>
                <div>
                  <strong>Delete my account</strong>
                  <span>Delete my account and account data</span>
                </div>
                <svg
                  width="12"
                  height="13"
                  viewBox="0 0 12 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_4122_5754)">
                    <path
                      d="M3.03955 11.75C3.03973 11.5512 3.11886 11.3605 3.25955 11.22L7.09555 7.38401C7.21166 7.26793 7.30376 7.13012 7.3666 6.97844C7.42944 6.82676 7.46178 6.66419 7.46178 6.50001C7.46178 6.33583 7.42944 6.17326 7.3666 6.02158C7.30376 5.8699 7.21166 5.73209 7.09555 5.61601L3.26455 1.78251C3.12793 1.64106 3.05234 1.45161 3.05405 1.25496C3.05575 1.05831 3.13463 0.870201 3.27369 0.731145C3.41274 0.592088 3.60085 0.513212 3.7975 0.511503C3.99415 0.509794 4.1836 0.58539 4.32505 0.722008L8.15605 4.55251C8.67117 5.06864 8.96047 5.76806 8.96047 6.49726C8.96047 7.22646 8.67117 7.92588 8.15605 8.44201L4.32005 12.278C4.21531 12.3828 4.08187 12.4543 3.93657 12.4833C3.79128 12.5123 3.64063 12.4977 3.50364 12.4412C3.36666 12.3847 3.24948 12.2889 3.16688 12.1659C3.08428 12.0429 3.03998 11.8982 3.03955 11.75Z"
                      fill="#0B0D17"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4122_5754">
                      <rect
                        width="12"
                        height="12"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </DeleteAccountButton>
              <SaveButton
                disabled={loading || !email}
                onClick={handleSaveButtonClick}
              >
                Save
              </SaveButton>
            </>
          )}
          {view && view === "account_delete" && (
            <>
              <BackButton onClick={handleBackButtonClick}>
                <svg
                  width="12"
                  height="13"
                  viewBox="0 0 12 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_4122_6171)">
                    <path
                      d="M8.96047 1.25254C8.9603 1.45138 8.88117 1.64202 8.74047 1.78254L4.90447 5.61854C4.78836 5.73462 4.69626 5.87243 4.63342 6.02411C4.57058 6.17579 4.53824 6.33836 4.53824 6.50254C4.53824 6.66672 4.57058 6.82929 4.63342 6.98097C4.69626 7.13265 4.78836 7.27046 4.90447 7.38654L8.73547 11.2175C8.87209 11.359 8.94769 11.5484 8.94598 11.7451C8.94427 11.9417 8.86539 12.1298 8.72634 12.2689C8.58728 12.408 8.39917 12.4868 8.20252 12.4885C8.00588 12.4903 7.81642 12.4147 7.67497 12.278L3.84397 8.45004C3.32886 7.93391 3.03955 7.23449 3.03955 6.50529C3.03955 5.77608 3.32886 5.07667 3.84397 4.56054L7.67997 0.722038C7.78486 0.61708 7.91853 0.545594 8.06406 0.516627C8.20959 0.48766 8.36045 0.502513 8.49753 0.559307C8.63462 0.616101 8.75178 0.712283 8.83418 0.835682C8.91659 0.959081 8.96054 1.10415 8.96047 1.25254Z"
                      fill="#0B0D17"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4122_6171">
                      <rect
                        width="12"
                        height="12"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span>Account details</span>
              </BackButton>
              <Title>You will permanently delete:</Title>
              <Text>
                <ul>
                  <li>Your Grindery account</li>
                  <li>All your workflows</li>
                  <li>All workspaces where you are the only admin</li>
                </ul>
              </Text>
              <InputWrapper>
                <span>Paste your wallet address and click Delete account</span>
                <Input
                  type="text"
                  value={wallet}
                  onChange={handleWalletChange}
                />
              </InputWrapper>
              <ButtonsWrapper>
                <CancelButton onClick={handleCancelButtonClick}>
                  Cancel
                </CancelButton>
                <ConfirmDeleteButton
                  disabled={loading || address !== wallet}
                  onClick={handleConfirmDeleteClick}
                >
                  Delete account
                </ConfirmDeleteButton>
              </ButtonsWrapper>
            </>
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
      </Dialog>
      <Snackbar
        open={Boolean(snackbar)}
        handleClose={() => {
          setSnackbar("");
        }}
        message={snackbar}
        hideCloseButton
        autoHideDuration={2000}
        severity="success"
      />
    </>
  ) : null;
};

export default AccountModal;
