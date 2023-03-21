import { useContext } from 'react';
import { BuyPageContext } from '../context/BuyPageContext';

const useBuyPage = () => useContext(BuyPageContext);

export default useBuyPage;
