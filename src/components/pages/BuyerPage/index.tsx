import ApproveTransaction from "../../shared/ApproveTransaction";
import ClaimReward from "../../shared/ClaimReward";
import HonourOfferCrossChain from "../../shared/HonourOfferCrossChain";
import HonourOfferOnChain from "../../shared/HonourOfferOnChain";
import MakeOffer from "../../shared/MakeOffer";
import {RootWrapper} from "./style";

function BuyerPage() {
  return (
    <RootWrapper>
      <ApproveTransaction />
      <MakeOffer />
      <HonourOfferOnChain />
      <HonourOfferCrossChain />
      <ClaimReward />
    </RootWrapper>
  );
}

export default BuyerPage;
