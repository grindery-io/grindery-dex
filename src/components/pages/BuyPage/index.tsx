import {useLocation} from "react-router";
import AcceptOffer from "../../shared/AcceptOffer";
import Deposit from "../../shared/Deposit";
import {RootWrapper} from "./style";

function BuyPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let operation = searchParams.get("operation");
  let requestType = null;
  let nonce = null;
  let grtAmount = null;
  let erc20TokenAddress = null;
  let erc20TokenAmount = null;
  let address = null;
  let requestId = null;
  let offerId = null;

  switch (operation) {
    case "deposit":
      requestType = searchParams.get("request_type");
      nonce = searchParams.get("nonce");
      grtAmount = searchParams.get("grt_amount");
      erc20TokenAddress = searchParams.get("token_address");
      erc20TokenAmount = searchParams.get("token_amount");
      address = searchParams.get("address");
      break;

    case "accept_offer":
      requestId = searchParams.get("request_id");
      offerId = searchParams.get("offer_id");
      break;

    default:
      break;
  }

  console.log(operation);
  return (
    <RootWrapper>
      {operation === "deposit" || operation === null ? (
        <Deposit
          requestType={requestType}
          nonce={nonce}
          grtAmount={grtAmount}
          erc20TokenAddress={erc20TokenAddress}
          erc20TokenAmount={erc20TokenAmount}
          address={address}
        />
      ) : null}
      {operation === "accept_offer" || operation === null ? (
        <AcceptOffer requestId={requestId} offerId={offerId} />
      ) : null}
    </RootWrapper>
  );
}

export default BuyPage;
