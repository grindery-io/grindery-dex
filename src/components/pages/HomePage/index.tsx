import {useState} from "react";
import AppHeader from "../../shared/AppHeader";
import useWindowSize from "../../../hooks/useWindowSize";
import {Container, RootWrapper, RootWrapper2} from "./style";
import SellerPage from "../SellerPage";
import BuyerPage from "../BuyerPage";
import {useGrinderyNexus} from "use-grindery-nexus";
import FaucetPage from "../FaucetPage";
import {Routes, Route} from "react-router-dom";
import Settings from "../../shared/Settings";

const HomePage = () => {
  const [tab, setTab] = useState(0);
  const {size} = useWindowSize();
  const {address} = useGrinderyNexus();

  return (
    <>
      <Container>
        <AppHeader />
      </Container>
      <RootWrapper>
        <RootWrapper2>
          <Routes>
            <Route path="/buy" element={<BuyerPage />} />
            <Route path="/sell" element={<SellerPage />} />
            <Route path="/setting" element={<Settings />} />
            <Route path="/faucet" element={<FaucetPage />} />
          </Routes>
        </RootWrapper2>
      </RootWrapper>
    </>
  );
};

export default HomePage;
