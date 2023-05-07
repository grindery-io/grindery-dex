import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, abiStoreActions } from '../store';
import { getAbis } from '../services';

type AbiControllerProps = {
  children: React.ReactNode;
};

export const AbiController = ({ children }: AbiControllerProps) => {
  const dispatch = useAppDispatch();

  const fetchAbis = useCallback(async () => {
    dispatch(abiStoreActions.setLoading(true));
    const abis = await getAbis();
    dispatch(abiStoreActions.setAbis(abis));
    dispatch(abiStoreActions.setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    fetchAbis();
  }, [fetchAbis]);

  return <>{children}</>;
};

export default AbiController;
