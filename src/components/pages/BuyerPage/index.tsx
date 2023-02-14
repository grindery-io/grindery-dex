import Approve from "../../shared/Approve";
import MakeOffer from "../../shared/MakeOffer";
import HonourOfferOnChain from "../../shared/HonourOfferOnChain";
import HonourOfferCrossChain from "../../shared/HonourOfferCrossChain";
import ClaimReward from "../../shared/ClaimReward";
import {RootWrapper} from "./style";

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
