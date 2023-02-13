import React, {useState} from "react";
import {TextInput, Button} from "grindery-ui";
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
