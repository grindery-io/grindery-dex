import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/storeHooks';
import { selectUserAccessToken } from '../store/slices/userSlice';
import { getChainsWithTokens } from '../services/chainServices';
import { setChainsItems, setChainsLoading } from '../store/slices/chainsSlice';

type ChainsControllerProps = {
  children: React.ReactNode;
};

export const ChainsController = ({ children }: ChainsControllerProps) => {
  const accessToken = useAppSelector(selectUserAccessToken);
  const dispatch = useAppDispatch();

  const getChains = async (accessToken: string) => {
    dispatch(setChainsLoading(true));
    const chains = await getChainsWithTokens(accessToken);
    dispatch(setChainsItems(chains || []));
    dispatch(setChainsLoading(false));
  };

  useEffect(() => {
    if (accessToken) {
      getChains(accessToken);
    }
  }, [accessToken]);

  return <>{children}</>;
};

export default ChainsController;
