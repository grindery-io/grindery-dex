import AcceptOffer from "../../shared/AcceptOffer";
import Approve from "../../shared/ApproveTransaction";
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
