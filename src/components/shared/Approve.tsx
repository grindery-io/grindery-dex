import {TextInput, Button} from "grindery-ui";
import {useState} from "react";
import styled from "styled-components";
import {SCREEN} from "../../constants";

const ButtonWrapper = styled.div`
  margin: 32px 0 0;
  text-align: right;
`;

const Title = styled.p`
  font-weight: 700;
  font-size: 25px;
  line-height: 120%;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
  padding: 0 50px;
  margin: 0 0 15px;
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 0;
    max-width: 576px;
    margin: 0 auto 15px;
  }
`;

function Approve() {
  const [spenderAddress, setSpenderAddress] = useState<string | null>("");
  const [amount, setAmount] = useState<string | null>("");

  const handleClick = async () => {};

  return (
    <>
      <Title>Approve</Title>
      <TextInput
        value={spenderAddress}
        onChange={(spenderAddress: string) => setSpenderAddress(spenderAddress)}
        label="Spender Address"
        required
      />
      <TextInput
        value={amount}
        onChange={(amount: string) => setAmount(amount)}
        label="Amount"
        required
      />
      <ButtonWrapper>
        <Button value="Approve" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default Approve;
