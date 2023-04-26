import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, setChainsItems, setChainsLoading } from '../store';
import { getChainsWithTokens } from '../services';

type ChainsControllerProps = {
  children: React.ReactNode;
};

export const ChainsController = ({ children }: ChainsControllerProps) => {
  const dispatch = useAppDispatch();

  const getChains = useCallback(async () => {
    dispatch(setChainsLoading(true));
    const chains = await getChainsWithTokens();
    dispatch(setChainsItems(chains || []));
    dispatch(setChainsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    getChains();
  }, [getChains]);

  return <>{children}</>;
};

export default ChainsController;
