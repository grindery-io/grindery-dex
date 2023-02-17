import {useLocation} from "react-router";
import ClaimReward from "../../shared/ClaimReward";
import HonourOfferOnChain from "../../shared/HonourOfferOnChain";
import MakeOffer from "../../shared/MakeOffer";
import {RootWrapper} from "./style";

function BuyerPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let operation = searchParams.get("operation");
  let amount = null;
  let requestId = null;
  let offerId = null;

  switch (operation) {
    case "offer":
      amount = searchParams.get("amount");
      requestId = searchParams.get("request_id");
      break;

    case "honour":
      requestId = searchParams.get("request_id");
      offerId = searchParams.get("offer_id");
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
      <ClaimReward requestId={requestId} offerId={offerId} />
    </RootWrapper>
  );
}

export default BuyerPage;
