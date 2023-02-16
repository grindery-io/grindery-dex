import AcceptOffer from "../../shared/AcceptOffer";
import Deposit from "../../shared/Deposit";
import {RootWrapper} from "./style";

function SellerPage() {
  return (
    <RootWrapper>
      <Deposit />
      <AcceptOffer />
    </RootWrapper>
  );
}

export default SellerPage;
