import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, chainsStoreActions } from '../store';
import { getChainsWithTokens } from '../services';
import { sortChains } from '../utils';

type ChainsProviderProps = {
  children: React.ReactNode;
};

export const ChainsProvider = ({ children }: ChainsProviderProps) => {
  const dispatch = useAppDispatch();

  const getChains = useCallback(async () => {
    dispatch(chainsStoreActions.setLoading(true));
    const chains = await getChainsWithTokens();
    dispatch(chainsStoreActions.setItems(sortChains(chains || [])));
    dispatch(chainsStoreActions.setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    getChains();
  }, [getChains]);

  return <>{children}</>;
};

export default ChainsProvider;
