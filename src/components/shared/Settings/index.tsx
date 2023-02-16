import UserSettings from "../UserSettings";
import ApproveTransaction from "../ApproveTransaction";
import OwnerSettings from "../OwnerSettings";
import DecodeEvents from "../DecodeEvents";

function Settings() {
  return (
    <>
      <ApproveTransaction />
      <UserSettings />
      <OwnerSettings />
      <DecodeEvents />
    </>
  );
}

export default Settings;
