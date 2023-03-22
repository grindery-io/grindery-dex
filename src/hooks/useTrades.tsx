import { useContext } from 'react';
import { TradesContext } from '../context/TradesContext';

const useTrades = () => useContext(TradesContext);

export default useTrades;
