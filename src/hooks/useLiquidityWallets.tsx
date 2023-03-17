import { useContext } from 'react';
import { LiquidityWalletsContext } from '../context/LiquidityWalletsContext';

const useLiquidityWallets = () => useContext(LiquidityWalletsContext);

export default useLiquidityWallets;
