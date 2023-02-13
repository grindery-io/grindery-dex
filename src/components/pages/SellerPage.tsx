import React from "react";
import styled from "styled-components";
import AcceptOffer from "../shared/AcceptOffer";
import Approve from "../shared/Approve";
import Deposit from "../shared/Deposit";

const RootWrapper = styled.div`
  margin 30px;
`;

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
