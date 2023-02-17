import UserSettings from "../UserSettings";
import ApproveTransaction from "../ApproveTransaction";
import OwnerSettings from "../OwnerSettings";
import DecodeEvents from "../DecodeEvents";
import {RootWrapper} from "./style";

function Settings() {
  return (
    <RootWrapper>
      <ApproveTransaction />
      <UserSettings />
      <OwnerSettings />
      <DecodeEvents />
    </RootWrapper>
  );
}

export default Settings;
