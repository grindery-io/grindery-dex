import { useContext } from 'react';
import { OrdersPageContext } from '../context/OrdersPageContext';

const useOrdersPage = () => useContext(OrdersPageContext);

export default useOrdersPage;
