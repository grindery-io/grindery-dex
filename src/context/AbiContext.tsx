import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

// Context props
type ContextProps = {
  isLoading: boolean;
  poolAbi: any;
  tokenAbi: any;
  satelliteAbi: any;
  liquidityWalletAbi: any;
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
  satelliteAbi: null,
  liquidityWalletAbi: null,
});

export const AbiContextProvider = ({ children }: AbiContextProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [poolAbi, setPoolAbi] = useState<any>(null);
  const [tokenAbi, setTokenAbi] = useState<any>(null);
  const [satelliteAbi, setSatelliteAbi] = useState<any>(null);
  const [liquidityWalletAbi, setLiquidityWalletAbi] = useState<any>(null);

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

  const getSatelliteContractAbi = async () => {
    const _satelliteAbi = await axios.get(
      `https://raw.githubusercontent.com/grindery-io/Depay-Reality/main/abis/GrtSatellite.json`
    );
    setSatelliteAbi(_satelliteAbi.data || null);
    setIsLoading(false);
  };

  const getLiquidityWalletContractAbi = async () => {
    const _liquidityWalletAbi = await axios.get(
      `https://raw.githubusercontent.com/grindery-io/Depay-Reality/main/abis/GrtLiquidityWallet.json`
    );
    setLiquidityWalletAbi(_liquidityWalletAbi.data || null);
    setIsLoading(false);
  };

  useEffect(() => {
    getPoolContractAbi();
    getTokenContractAbi();
    getSatelliteContractAbi();
    getLiquidityWalletContractAbi();
  }, []);

  return (
    <AbiContext.Provider
      value={{
        isLoading,
        poolAbi,
        tokenAbi,
        satelliteAbi,
        liquidityWalletAbi,
      }}
    >
      {children}
    </AbiContext.Provider>
  );
};

export default AbiContextProvider;
