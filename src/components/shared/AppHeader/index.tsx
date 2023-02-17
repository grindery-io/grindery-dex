import useAppContext from "../../../hooks/useAppContext";
import Logo from "../Logo";
import UserMenu from "../UserMenu";
import {useGrinderyNexus} from "use-grindery-nexus";
import {
  Wrapper,
  LogoWrapper,
  CompanyNameWrapper,
  ConnectWrapper,
  UserWrapper,
  LinksWrapper,
} from "./style";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import BuyerPage from "../../pages/BuyerPage";
type Props = {};

const AppHeader = (props: Props) => {
  const {user} = useAppContext();
  const {connect} = useGrinderyNexus();

  return (
    <Wrapper>
      <LogoWrapper>
        <Logo variant="square" />
      </LogoWrapper>
      <CompanyNameWrapper>DeMM</CompanyNameWrapper>
      <LinksWrapper>
        <Link to="/buy">Buy</Link>
        <Link to="/sell">Sell</Link>
        <Link to="/setting">Settings</Link>
        <Link to="/faucet">Faucet</Link>
      </LinksWrapper>
      {!user && "ethereum" in window && (
        <ConnectWrapper>
          <button
            onClick={() => {
              connect();
            }}
          >
            Connect wallet
          </button>
        </ConnectWrapper>
      )}
      {user && (
        <UserWrapper>
          <UserMenu />
        </UserWrapper>
      )}
    </Wrapper>
  );
};

export default AppHeader;
