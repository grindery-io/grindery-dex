import { useContext } from 'react';
import { TradesBPageContext } from '../context/TradesBPageContext';

const useTradesBPage = () => useContext(TradesBPageContext);

export default useTradesBPage;
