import UserSettings from "../UserSettings";
import ApproveTransaction from "../ApproveTransaction";
import OwnerSettings from "../OwnerSettings";

function Settings() {
  return (
    <>
      <ApproveTransaction />
      <UserSettings />
      <OwnerSettings />
    </>
  );
}

export default Settings;
