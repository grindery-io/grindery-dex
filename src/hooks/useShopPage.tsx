import { useContext } from 'react';
import { ShopPageContext } from '../context/ShopPageContext';

const useShopPage = () => useContext(ShopPageContext);

export default useShopPage;
