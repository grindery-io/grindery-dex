import React, { useCallback, useEffect } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  selectUserAccessToken,
  setChainsItems,
  setChainsLoading,
} from '../store';
import { getChainsWithTokens } from '../services';

type ChainsControllerProps = {
  children: React.ReactNode;
};

export const ChainsController = ({ children }: ChainsControllerProps) => {
  const accessToken = useAppSelector(selectUserAccessToken);
  const dispatch = useAppDispatch();

  const getChains = useCallback(
    async (accessToken: string) => {
      dispatch(setChainsLoading(true));
      const chains = await getChainsWithTokens(accessToken);
      dispatch(setChainsItems(chains || []));
      dispatch(setChainsLoading(false));
    },
    [dispatch]
  );

  useEffect(() => {
    if (accessToken) {
      getChains(accessToken);
    }
  }, [accessToken, getChains]);

  return <>{children}</>;
};

export default ChainsController;
