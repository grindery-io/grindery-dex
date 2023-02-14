import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {ButtonWrapper, Title} from "./style";

function AcceptOffer() {
  const [offerId, setOfferId] = useState<string | null>("");
  const [requestId, setRequestId] = useState<string | null>("");

  const handleClick = async () => {};

  return (
    <>
      <Title>Accept Offer</Title>
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
        <Button value="Accept" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default AcceptOffer;
