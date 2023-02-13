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
