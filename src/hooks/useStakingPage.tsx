import { useContext } from 'react';
import { StakingPageContext } from '../context/StakingPageContext';

const useStakingPage = () => useContext(StakingPageContext);

export default useStakingPage;
