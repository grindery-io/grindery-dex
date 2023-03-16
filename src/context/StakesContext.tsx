import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { Stake } from '../types/Stake';

// Context props
type ContextProps = {
  isLoading: boolean;
  stakes: Stake[];
  setStakes: React.Dispatch<React.SetStateAction<Stake[]>>;
};

// Context provider props
type StakesContextProps = {
  children: React.ReactNode;
};

// Init context
export const StakesContext = createContext<ContextProps>({
  isLoading: true,
  stakes: [],
  setStakes: () => {},
});

export const StakesContextProvider = ({ children }: StakesContextProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stakes, setStakes] = useState<Stake[]>([]);

  const getStakes = async () => {
    setStakes([]);
    setIsLoading(false);
  };

  useEffect(() => {
    getStakes();
  }, []);

  return (
    <StakesContext.Provider
      value={{
        isLoading,
        stakes,
        setStakes,
      }}
    >
      {children}
    </StakesContext.Provider>
  );
};

export default StakesContextProvider;
