import FaucetPage from '../../pages/FaucetPage/FaucetPage';
import LiquidityWalletPage from '../../pages/LiquidityWalletPage/LiquidityWalletPage';
import OffersPage from '../../pages/OffersPage/OffersPage';
import StakingPage from '../../pages/StakingPage/StakingPage';

export const dexPages = [
  {
    path: '/faucet',
    label: 'Faucet',
    component: <FaucetPage />,
  },
  {
    path: '/staking',
    label: 'Staking',
    component: <StakingPage />,
  },
  {
    path: '/offers',
    label: 'Offers',
    component: <OffersPage />,
  },
  {
    path: '/liquidity-wallet',
    label: 'Liquidity wallet',
    component: <LiquidityWalletPage />,
  },
];
