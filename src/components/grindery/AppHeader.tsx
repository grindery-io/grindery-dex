import React from 'react';
import styled from 'styled-components';
import useAppContext from '../../hooks/useAppContext';
import Logo from './Logo';
import { SCREEN } from '../../constants';
import UserMenu from './UserMenu';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { useNavigate } from 'react-router';

const Wrapper = styled.div`
  border-bottom: 1px solid #dcdcdc;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 10px;
  position: fixed;
  left: 0;
  top: 0;
  background: #ffffff;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  z-index: 2;
  @media (min-width: ${SCREEN.TABLET}) {
    width: 100%;
    top: 0;
    max-width: 100%;
  }
`;

const UserWrapper = styled.div`
  margin-left: auto;
  order: 4;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 4;
  }
`;

/*const AppsMenuWrapper = styled.div`
  order: 4;
  margin-left: auto;

  @media (max-width: ${SCREEN.TABLET}) {
    & .apps-menu__dropdown {
      min-width: 200px;
      max-width: 200px;

      & > ul {
        min-width: 200px !important;
      }
    }
  }
`;*/

const LogoWrapper = styled.a`
  display: block;
  text-decoration: none;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 2;
  }
`;

const CompanyNameWrapper = styled.a`
  display: block;
  order: 3;
  font-weight: 700;
  font-size: 16px;
  line-height: 110%;
  color: #0b0d17;
  cursor: pointer;
  text-decoration: none;
`;

const LinksWrapper = styled.div`
  margin-left: auto;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
  order: 3;

  & a {
    font-size: 16px;
    line-height: 150%;
    text-decoration: none;
    display: inline-block;
    color: #0b0d17;
    cursor: pointer;
  }
`;

const ConnectWrapper = styled.div`
  display: none;
  margin-left: auto;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 4;
    display: block;
    margin-left: auto;

    & button {
      background: #0b0d17;
      border-radius: 5px;
      box-shadow: none;
      font-weight: 700;
      font-size: 16px;
      line-height: 150%;
      color: #ffffff;
      padding: 8px 24px;
      cursor: pointer;
      border: none;

      &:hover {
        box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
      }
    }
  }
`;

type Props = {};

const AppHeader = (props: Props) => {
  let navigate = useNavigate();
  const { user } = useAppContext();
  const { connect } = useGrinderyNexus();

  return (
    <Wrapper>
      <LogoWrapper
        href="/"
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        <Logo variant="square" />
      </LogoWrapper>
      <CompanyNameWrapper
        href="/"
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        Gateway
      </CompanyNameWrapper>
      {/*<AppsMenuWrapper>
        <AppsMenu apps={GRINDERY_APPS} />
      </AppsMenuWrapper>*/}
      {
        <LinksWrapper>
          {/*<a
            href="/swap"
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              event.preventDefault();
              navigate('/swap');
            }}
          >
            Swap
          </a>*/}
          <a
            href="/faucet"
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              event.preventDefault();
              navigate('/faucet');
            }}
          >
            Faucet
          </a>
          <a
            href="/staking"
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              event.preventDefault();
              navigate('/staking');
            }}
          >
            Staking
          </a>
        </LinksWrapper>
      }
      {!user && 'ethereum' in window && (
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
