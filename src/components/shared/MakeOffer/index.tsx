import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {ButtonWrapper, Title} from "./style";

function MakeOffer() {
  const [amount, setAmount] = useState<string | null>("");
  const [requestId, setRequestId] = useState<string | null>("");

  const handleClick = async () => {};

  return (
    <>
      <Title>Make Offer</Title>
      <TextInput
        onChange={(amount: string) => setAmount(amount)}
        label="Amount"
        required
      />
      <TextInput
        onChange={(requestId: string) => setRequestId(requestId)}
        label="Request Id"
        required
      />
      <ButtonWrapper>
        <Button value="Offer" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default MakeOffer;
