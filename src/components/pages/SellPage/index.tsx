import {useLocation} from "react-router";
import ClaimReward from "../../shared/ClaimReward";
import HonourOfferCrossChain from "../../shared/HonourOfferCrossChain";
import HonourOfferOnChain from "../../shared/HonourOfferOnChain";
import MakeOffer from "../../shared/MakeOffer";
import {RootWrapper} from "./style";

function SellPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let operation = searchParams.get("operation");
  let amount = null;
  let requestId = null;
  let offerId = null;
  let tokenAddress = null;
  let toAddress = null;

  switch (operation) {
    case "offer":
      amount = searchParams.get("amount");
      requestId = searchParams.get("request_id");
      break;

    case "honour_on_chain":
      requestId = searchParams.get("request_id");
      offerId = searchParams.get("offer_id");
      break;

    case "honour_cross_chain":
      tokenAddress = searchParams.get("token_address");
      toAddress = searchParams.get("to_address");
      amount = searchParams.get("amount");
      break;

    case "claim":
      requestId = searchParams.get("request_id");
      offerId = searchParams.get("offer_id");
      break;

    default:
      break;
  }

  return (
    <RootWrapper>
      <MakeOffer requestId={requestId} amount={amount} />
      <HonourOfferOnChain requestId={requestId} offerId={offerId} />
      <HonourOfferCrossChain
        tokenAddress={tokenAddress}
        toAddress={toAddress}
        amount={amount}
      />
      <ClaimReward requestId={requestId} offerId={offerId} />
    </RootWrapper>
  );
}

export default SellPage;
