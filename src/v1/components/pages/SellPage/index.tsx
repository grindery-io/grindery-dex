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
  let tokenType = null;
  let chainIdDeposit = null;

  switch (operation) {
    case "offer":
      amount = searchParams.get("amount");
      requestId = searchParams.get("request_id");
      break;

    case "honour_on_chain":
      requestId = searchParams.get("request_id");
      offerId = searchParams.get("offer_id");
      tokenType = searchParams.get("token");
      break;

    case "honour_cross_chain":
      requestId = searchParams.get("request_id");
      offerId = searchParams.get("offer_id");
      chainIdDeposit = searchParams.get("chain_id_deposit");
      tokenAddress = searchParams.get("token_address");
      toAddress = searchParams.get("to_address");
      amount = searchParams.get("amount");
      tokenType = searchParams.get("token");
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
      {operation === "offer" || operation === null ? (
        <MakeOffer requestId={requestId} amount={amount} />
      ) : null}
      {operation === "honour_on_chain" || operation === null ? (
        <HonourOfferOnChain
          requestId={requestId}
          offerId={offerId}
          tokenType={tokenType}
        />
      ) : null}
      {operation === "honour_cross_chain" || operation === null ? (
        <HonourOfferCrossChain
          requestId={requestId}
          offerId={offerId}
          chainIdDeposit={chainIdDeposit}
          tokenAddress={tokenAddress}
          toAddress={toAddress}
          amount={amount}
          tokenType={tokenType}
        />
      ) : null}
      {operation === "claim" || operation === null ? (
        <ClaimReward requestId={requestId} offerId={offerId} />
      ) : null}
    </RootWrapper>
  );
}

export default SellPage;
