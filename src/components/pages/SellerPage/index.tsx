import React from "react";
import AcceptOffer from "../../shared/AcceptOffer";
import Approve from "../../shared/Approve";
import Deposit from "../../shared/Deposit";
import {RootWrapper} from "./style";

function SellerPage() {
  return (
    <RootWrapper>
      <Approve />
      <Deposit />
      <AcceptOffer />
    </RootWrapper>
  );
}

export default SellerPage;
