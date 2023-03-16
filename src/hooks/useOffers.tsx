import { useContext } from 'react';
import { OffersContext } from '../context/OffersContext';

const useOffers = () => useContext(OffersContext);

export default useOffers;
