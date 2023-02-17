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
} from "./style";

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
