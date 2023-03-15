import { useContext } from 'react';
import { AbiContext } from '../context/AbiContext';

const useAbi = () => useContext(AbiContext);

export default useAbi;
