import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

// Context props
type ContextProps = {
  isLoading: boolean;
  stakingAbi: any;
};

// Context provider props
type AbiContextProps = {
  children: React.ReactNode;
};

// Init context
export const AbiContext = createContext<ContextProps>({
  isLoading: true,
  stakingAbi: null,
});

export const AbiContextProvider = ({ children }: AbiContextProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stakingAbi, setStakingAbi] = useState<any>(null);

  const getPoolContractAbi = async () => {
    const contractAbi = await axios.get(
      `https://raw.githubusercontent.com/grindery-io/Depay-Reality/main/abis/v0.2.0/utils/GrtTokenUtils.sol/GrtTokenUtils.json`
    );
    setStakingAbi(contractAbi.data?.abi || null);
    setIsLoading(false);
  };

  useEffect(() => {
    getPoolContractAbi();
  }, []);

  return (
    <AbiContext.Provider
      value={{
        isLoading,
        stakingAbi,
      }}
    >
      {children}
    </AbiContext.Provider>
  );
};

export default AbiContextProvider;
