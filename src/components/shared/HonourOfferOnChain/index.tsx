import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {Title, ButtonWrapper} from "./style";
import { GRT_CONTRACT_ADDRESS } from "../../../constants";

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
        placeholder={"0"}
      />
      <TextInput
        onChange={(requestId: string) => setRequestId(requestId)}
        label="Request Id"
        required
        placeholder={"0xd2b8dbec86dba5f9b5c34f84d0dc19bf715f984e3c78051e5ffa813a1d29dd73"}
      />
      <TextInput
        onChange={(address: string) => setAddress(address)}
        label="Token Address"
        required
        placeholder={GRT_CONTRACT_ADDRESS}
      />
      <TextInput
        onChange={(amount: string) => setAmount(amount)}
        label="Amount"
        required
        placeholder={"1"}
      />
      <ButtonWrapper>
        <Button value="Honour" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default HonourOfferOnChain;
