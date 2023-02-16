import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {Title, ButtonWrapper} from "./style";

function HonourOfferOnChain() {
  const [offerId, setOfferId] = useState<string | null>("");
  const [requestId, setRequestId] = useState<string | null>("");
  const [address, setAddress] = useState<string | null>("");
  const [amount, setAmount] = useState<string | null>("");

  const handleClick = async () => {};

  return (
    <>
      <Title>Honour Offer On-chain</Title>
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
      <TextInput
        onChange={(address: string) => setAddress(address)}
        label="Token Address"
        required
      />
      <TextInput
        onChange={(amount: string) => setAmount(amount)}
        label="Amount"
        required
      />
      <ButtonWrapper>
        <Button value="Honour" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default HonourOfferOnChain;
