import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import PageContainer from '../../components/PageContainer/PageContainer';
import SellMenu from '../../components/SellMenu/SellMenu';
import LiquidityWalletPageContextProvider from '../../context/LiquidityWalletPageContext';
import OffersPageContextProvider from '../../context/OffersPageContext';
import StakingPageContextProvider from '../../context/StakingPageContext';
import TradesBPageContextProvider from '../../context/TradesBPageContext';
import TradesContextProvider from '../../context/TradesContext';
import useAdmin from '../../hooks/useAdmin';
import LiquidityWalletPage from '../LiquidityWalletPage/LiquidityWalletPage';
import OffersPage from '../OffersPage/OffersPage';
import StakingPage from '../StakingPage/StakingPage';
import TradesBPage from '../TradesBPage/TradesBPage';

export const sellPages = [
  // {
  //   path: '/staking',
  //   fullPath: '/sell/staking',
  //   label: 'Staking',
  //   component: (
  //     <StakingPageContextProvider>
  //       <StakingPage />
  //     </StakingPageContextProvider>
  //   ),
  // },
  {
    path: '/offers',
    fullPath: '/sell/offers',
    label: 'Offers',
    component: (
      <OffersPageContextProvider>
        <OffersPage />
      </OffersPageContextProvider>
    ),
  },
  {
    path: '/trades',
    fullPath: '/sell/trades',
    label: 'Orders',
    component: (
      <TradesContextProvider userType="b">
        <TradesBPageContextProvider>
          <TradesBPage />
        </TradesBPageContextProvider>
      </TradesContextProvider>
    ),
  },
  // {
  //   path: '/wallets',
  //   fullPath: '/sell/wallets',
  //   label: 'Wallets',
  //   component: (
  //     <LiquidityWalletPageContextProvider>
  //       <LiquidityWalletPage />
  //     </LiquidityWalletPageContextProvider>
  //   ),
  // },
];

type Props = {};

const SellPage = (props: Props) => {
  const { isLoading, isAdmin } = useAdmin();
  if (isLoading) {
    return <Loading />;
  }
  return isAdmin ? (
    <div>
      <PageContainer>
        <SellMenu />
        <Routes>
          {sellPages.map((page: any) => (
            <Route
              key={page.path}
              path={`${page.path}/*`}
              element={page.component}
            />
          ))}
          <Route
            path="/"
            element={<Navigate to={`/sell${sellPages[0].path}`} />}
          />
        </Routes>
      </PageContainer>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default SellPage;
