import { useContext } from 'react';
import { GrinderyChainsContext } from '../context/GrinderyChainsContext';

const useGrinderyChains = () => useContext(GrinderyChainsContext);

export default useGrinderyChains;
