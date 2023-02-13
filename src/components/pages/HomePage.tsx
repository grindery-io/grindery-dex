import React, {useState} from "react";
import styled from "styled-components";
import AppHeader from "../shared/AppHeader";
import SellerPage from "./SellerPage";
import {SCREEN} from "../../constants";
import {Tabs} from "grindery-ui";
import useWindowSize from "../../hooks/useWindowSize";
import BuyerPage from "./BuyerPage";
import OwnerPage from "./OwnerPage";

const Container = styled.div`
  padding: 120px 20px 0px;
`;

const RootWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RootWrapper2 = styled.div`
  max-width: calc(75vw - 30px);
  padding: 10px;
  width: 50rem;
  @media (min-width: ${SCREEN.TABLET}) {
    margin: 40px 20px 0;
    border: 1px solid #dcdcdc;
    max-width: auto;
  }
  @media (min-width: ${SCREEN.DESKTOP}) {
    margin: 20px 20px 0;
  }
  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    margin: 100px 20px 0;
  }
`;

const TabsWrapper = styled.div`
  & .MuiTab-root {
    text-transform: initial;
    font-weight: 400;
    font-size: var(--text-size-horizontal-tab-label);
    line-height: 150%;

    @media (min-width: ${SCREEN.TABLET}) {
      min-width: 150px;
    }
  }
`;

const HomePage = () => {
  const [tab, setTab] = useState(0);
  const {size} = useWindowSize();

  return (
    <>
      <Container>
        <AppHeader />
      </Container>
      <RootWrapper>
        <RootWrapper2>
          <TabsWrapper>
            <Tabs
              value={tab}
              onChange={(index: number) => {
                setTab(index);
              }}
              options={["Sellers", "Buyer", "Owner"]}
              orientation="horizontal"
              activeIndicatorColor="#A963EF"
              activeColor="#8C30F5"
              type="text"
              tabColor=""
              variant={size === "phone" ? "fullWidth" : ""}
            />
            {tab === 0 && <SellerPage />}
            {tab === 1 && <BuyerPage />}
            {tab === 2 && <OwnerPage />}
          </TabsWrapper>
        </RootWrapper2>
      </RootWrapper>
    </>
  );
};

export default HomePage;
