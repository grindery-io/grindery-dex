import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {Title, ButtonWrapper} from "./style";

function ConfigEdit() {
  const [grtAddress, setGrtAddress] = useState<string | null>("");
  const [chainId, setChainId] = useState<string | null>("");
  const [realityAddress, setRealityAddress] = useState<string | null>("");

  const handleClick = async () => {};

  return (
    <>
      <Title>Edit Smart Contract Configuration</Title>
      <TextInput
        onChange={(grtAddress: string) => setGrtAddress(grtAddress)}
        label="GRT Address"
        required
      />
      <TextInput
        onChange={(chainId: string) => setChainId(chainId)}
        label="Chain Id"
        required
      />
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
