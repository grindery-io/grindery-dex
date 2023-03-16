import { useContext } from 'react';
import { StakesContext } from '../context/StakesContext';

const useStakes = () => useContext(StakesContext);

export default useStakes;
