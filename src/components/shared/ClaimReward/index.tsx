import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {Title, ButtonWrapper} from "./style";

function ClaimReward() {
  const [offerId, setOfferId] = useState<string | null>("");
  const [requestId, setRequestId] = useState<string | null>("");

  const handleClick = async () => {};

  return (
    <>
      <Title>Claim Reward</Title>
      <TextInput
        onChange={(offerId: string) => setOfferId(offerId)}
        label="Offer Id"
        required
        placeholder={"0"}
      />
      <TextInput
        onChange={(requestId: string) => setRequestId(requestId)}
        label="Request Id"
        required
        placeholder={"0xd2b8dbec86dba5f9b5c34f84d0dc19bf715f984e3c78051e5ffa813a1d29dd73"}
      />
      <ButtonWrapper>
        <Button value="Claim" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default ClaimReward;
