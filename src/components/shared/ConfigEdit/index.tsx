import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {Title, SubTitle, ButtonWrapper} from "./style";

function ConfigEdit() {
  const [amountGrt, setAmountGrt] = useState<string | null>("");
  const [grtAddress, setGrtAddress] = useState<string | null>("");
  const [chainId, setChainId] = useState<string | null>("");
  const [realityAddress, setRealityAddress] = useState<string | null>("");

  const handleClick = async () => {};

  return (
    <>
      <Title>Edit Smart Contract Configuration</Title>


      <SubTitle>Mint GRT tokens</SubTitle>
      <TextInput
        onChange={(amountGrt: string) => setGrtAddress(amountGrt)}
        label="Amount (GRT)"
        required
      />
      <ButtonWrapper>
        <Button value="Update" size="small" onClick={handleClick} />
      </ButtonWrapper>


      <SubTitle>Modify GRT address</SubTitle>
      <TextInput
        onChange={(grtAddress: string) => setGrtAddress(grtAddress)}
        label="GRT Address"
        required
      />
      <ButtonWrapper>
        <Button value="Update" size="small" onClick={handleClick} />
      </ButtonWrapper>


      <SubTitle>Modify GRT chain Id</SubTitle>
      <TextInput
        onChange={(chainId: string) => setChainId(chainId)}
        label="Chain Id"
        required
      />
      <ButtonWrapper>
        <Button value="Update" size="small" onClick={handleClick} />
      </ButtonWrapper>


      <SubTitle>Modify Reality.eth address</SubTitle>
      <TextInput
        onChange={(realityAddress: string) => setRealityAddress(realityAddress)}
        label="Reality Smart Contract Address"
        required
      />
      <ButtonWrapper>
        <Button value="Update" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default ConfigEdit;
