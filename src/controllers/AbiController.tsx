import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, setAbiLoading, setAbis } from '../store';
import { getAbis } from '../services';

type AbiControllerProps = {
  children: React.ReactNode;
};

export const AbiController = ({ children }: AbiControllerProps) => {
  const dispatch = useAppDispatch();

  const fetchAbis = useCallback(async () => {
    dispatch(setAbiLoading(true));
    const abis = await getAbis();
    dispatch(setAbis(abis));
    dispatch(setAbiLoading(false));
  }, [dispatch]);

  useEffect(() => {
    fetchAbis();
  }, [fetchAbis]);

  return <>{children}</>;
};

export default AbiController;
