import AppHeader from "../../shared/AppHeader";
import {Container, RootWrapper, RootWrapper2} from "./style";
import SellPage from "../SellPage";
import FaucetPage from "../FaucetPage";
import {Routes, Route, Navigate} from "react-router-dom";
import Settings from "../../shared/Settings";
import useAppContext from "../../../hooks/useAppContext";
import BuyPage from "../BuyPage";

const HomePage = () => {
  const {user} = useAppContext();

  return (
    <>
      <Container>
        <AppHeader />
      </Container>
      <RootWrapper>
        {user && (
          <RootWrapper2>
            <Routes>
              <>
                <Route path="/" element={<Navigate to="/buy" />} />
                <Route path="/buy" element={<BuyPage />} />
                <Route path="/sell" element={<SellPage />} />
                <Route path="/setting" element={<Settings />} />
                <Route path="/faucet" element={<FaucetPage />} />
              </>
            </Routes>
          </RootWrapper2>
        )}
      </RootWrapper>
    </>
  );
};

export default HomePage;
