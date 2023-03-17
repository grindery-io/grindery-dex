import { useContext } from 'react';
import { LiquidityWalletPageContext } from '../context/LiquidityWalletPageContext';

const useLiquidityWalletPage = () => useContext(LiquidityWalletPageContext);

export default useLiquidityWalletPage;
