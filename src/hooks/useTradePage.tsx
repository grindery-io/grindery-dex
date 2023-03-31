import { useContext } from 'react';
import { TradePageContext } from '../context/TradePageContext';

const useTradePage = () => useContext(TradePageContext);

export default useTradePage;
