import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

// Context props
type ContextProps = {
  isLoading: boolean;
  stakingAbi: any;
  offersAbi: any;
};

// Context provider props
type AbiContextProps = {
  children: React.ReactNode;
};

// Init context
export const AbiContext = createContext<ContextProps>({
  isLoading: true,
  stakingAbi: null,
  offersAbi: null,
});

export const AbiContextProvider = ({ children }: AbiContextProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stakingAbi, setStakingAbi] = useState<any>(null);
  const [offersAbi, setOffersAbi] = useState<any>(null);

  const getPoolContractAbi = async () => {
    const contractAbi = await axios.get(
      `https://raw.githubusercontent.com/grindery-io/Depay-Reality/main/abis/ERC20Sample.json`
    );
    setStakingAbi(contractAbi.data || null);
    setIsLoading(false);
  };

  const getOffersContractAbi = async () => {
    const contractAbi = await axios.get(
      `https://raw.githubusercontent.com/grindery-io/Depay-Reality/main/abis/GrtPool.json`
    );
    setOffersAbi(contractAbi.data || null);
    setIsLoading(false);
  };

  useEffect(() => {
    getPoolContractAbi();
    getOffersContractAbi();
  }, []);

  return (
    <AbiContext.Provider
      value={{
        isLoading,
        stakingAbi,
        offersAbi,
      }}
    >
      {children}
    </AbiContext.Provider>
  );
};

export default AbiContextProvider;
