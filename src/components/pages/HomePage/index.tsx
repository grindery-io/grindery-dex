import AppHeader from "../../shared/AppHeader";
import {Container, RootWrapper, RootWrapper2} from "./style";
import SellerPage from "../SellerPage";
import BuyerPage from "../BuyerPage";
import FaucetPage from "../FaucetPage";
import {Routes, Route, Navigate} from "react-router-dom";
import Settings from "../../shared/Settings";

const HomePage = () => {
  return (
    <>
      <Container>
        <AppHeader />
      </Container>
      <RootWrapper>
        <RootWrapper2>
          <Routes>
            <Route path="/" element={<Navigate to="/buy" />} />
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
