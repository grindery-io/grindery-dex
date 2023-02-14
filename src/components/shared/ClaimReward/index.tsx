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
      />
      <TextInput
        onChange={(requestId: string) => setRequestId(requestId)}
        label="Request Id"
        required
      />
      <ButtonWrapper>
        <Button value="Claim" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default ClaimReward;
