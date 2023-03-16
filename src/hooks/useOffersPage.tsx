import { useContext } from 'react';
import { OffersPageContext } from '../context/OffersPageContext';

const useOffersPage = () => useContext(OffersPageContext);

export default useOffersPage;
