import {useState} from "react";
import AppHeader from "../../shared/AppHeader";
import {Tabs} from "grindery-ui";
import useWindowSize from "../../../hooks/useWindowSize";
import {Container, RootWrapper, RootWrapper2, TabsWrapper} from "./style";
import SellerPage from "../SellerPage";
import BuyerPage from "../BuyerPage";
import OwnerPage from "../OwnerPage";
import {useGrinderyNexus} from "use-grindery-nexus";
import FaucetPage from "../FaucetPage";

const HomePage = () => {
  const [tab, setTab] = useState(0);
  const {size} = useWindowSize();
  const {address} = useGrinderyNexus();

  return (
    <>
      <Container>
        <AppHeader />
      </Container>
      {address && (
        <RootWrapper>
          <RootWrapper2>
            <TabsWrapper>
              <Tabs
                value={tab}
                onChange={(index: number) => {
                  setTab(index);
                }}
                options={["Buy", "Sell", "Settings", "Faucets"]}
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
              {tab === 3 && <FaucetPage />}
            </TabsWrapper>
          </RootWrapper2>
        </RootWrapper>
      )}
    </>
  );
};

export default HomePage;
