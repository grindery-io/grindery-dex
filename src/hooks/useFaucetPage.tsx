import { useContext } from 'react';
import { FaucetPageContext } from '../context/FaucetPageContext';

const useFaucetPage = () => useContext(FaucetPageContext);

export default useFaucetPage;
