import { useContext } from 'react';
import { OrdersContext } from '../context/OrdersContext';

const useOrders = () => useContext(OrdersContext);

export default useOrders;
