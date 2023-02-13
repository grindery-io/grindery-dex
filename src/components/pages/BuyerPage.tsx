import Approve from "../shared/Approve";
import styled from "styled-components";
import MakeOffer from "../shared/MakeOffer";
import HonourOfferOnChain from "../shared/HonourOfferOnChain";
import HonourOfferCrossChain from "../shared/HonourOfferCrossChain";
import ClaimReward from "../shared/ClaimReward";

const RootWrapper = styled.div`
  margin 30px;
`;

function BuyerPage() {
  return (
    <RootWrapper>
      <Approve />
      <MakeOffer />
      <HonourOfferOnChain />
      <HonourOfferCrossChain />
      <ClaimReward />
    </RootWrapper>
  );
}

export default BuyerPage;
