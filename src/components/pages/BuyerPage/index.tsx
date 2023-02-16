import ClaimReward from "../../shared/ClaimReward";
import HonourOfferOnChain from "../../shared/HonourOfferOnChain";
import MakeOffer from "../../shared/MakeOffer";
import {RootWrapper} from "./style";

function BuyerPage() {
  return (
    <RootWrapper>
      <MakeOffer />
      <HonourOfferOnChain />
      <ClaimReward />
    </RootWrapper>
  );
}

export default BuyerPage;
