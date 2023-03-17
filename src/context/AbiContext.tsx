import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

// Context props
type ContextProps = {
  isLoading: boolean;
  poolAbi: any;
  tokenAbi: any;
};

// Context provider props
type AbiContextProps = {
  children: React.ReactNode;
};

// Init context
export const AbiContext = createContext<ContextProps>({
  isLoading: true,
  poolAbi: null,
  tokenAbi: null,
});

export const AbiContextProvider = ({ children }: AbiContextProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [poolAbi, setPoolAbi] = useState<any>(null);
  const [tokenAbi, setTokenAbi] = useState<any>(null);

  const getPoolContractAbi = async () => {
    const _poolAbi = await axios.get(
      `https://raw.githubusercontent.com/grindery-io/Depay-Reality/main/abis/GrtPool.json`
    );
    setPoolAbi(_poolAbi.data || null);
    setIsLoading(false);
  };

  const getTokenContractAbi = async () => {
    const _tokenAbi = await axios.get(
      `https://raw.githubusercontent.com/grindery-io/Depay-Reality/main/abis/ERC20Sample.json`
    );
    setTokenAbi(_tokenAbi.data || null);
    setIsLoading(false);
  };

  useEffect(() => {
    getPoolContractAbi();
    getTokenContractAbi();
  }, []);

  return (
    <AbiContext.Provider
      value={{
        isLoading,
        poolAbi,
        tokenAbi,
      }}
    >
      {children}
    </AbiContext.Provider>
  );
};

export default AbiContextProvider;
