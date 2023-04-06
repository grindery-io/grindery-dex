import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useAppDispatch, useAppSelector } from '../store/storeHooks';
import { selectUserAccessToken } from '../store/slices/userSlice';
import { setStakesItems, setStakesLoading } from '../store/slices/stakesSlice';
import {
  addStake,
  getStake,
  getUserStakes,
  updateStake,
} from '../services/stakeServices';
import { StakeType } from '../types/StakeType';

// Context props
type ContextProps = {
  createStake: (
    accessToken: string,
    body: { [key: string]: any }
  ) => Promise<StakeType | boolean>;
  editStake: (
    accessToken: string,
    {
      chainId,
      amount,
    }: {
      chainId: string;
      amount: string;
    }
  ) => Promise<boolean>;
};

export const StakesContext = createContext<ContextProps>({
  createStake: async () => false,
  editStake: async () => false,
});

type StakesControllerProps = {
  children: React.ReactNode;
};

export const StakesController = ({ children }: StakesControllerProps) => {
  const accessToken = useAppSelector(selectUserAccessToken);
  const dispatch = useAppDispatch();

  const fetchStakes = useCallback(
    async (accessToken: string) => {
      dispatch(setStakesLoading(true));
      const stakes = await getUserStakes(accessToken);
      dispatch(setStakesItems(stakes || []));
      dispatch(setStakesLoading(false));
    },
    [dispatch]
  );

  const fetchStake = async (accessToken: string, id: string) => {
    const stake = await getStake(accessToken, id).catch((err) => {
      // TODO: handle error
    });
    return stake;
  };

  const createStake = async (
    accessToken: string,
    body: { [key: string]: any }
  ): Promise<StakeType | boolean> => {
    const newStakeId = await addStake(accessToken, body).catch((err) => {
      // TODO: handle error
    });
    if (newStakeId) {
      const stake = await fetchStake(accessToken, newStakeId);
      if (stake) {
        return stake;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const editStake = async (
    accessToken: string,
    {
      chainId,
      amount,
    }: {
      chainId: string;
      amount: string;
    }
  ): Promise<boolean> => {
    const isEdited = await updateStake(accessToken, { chainId, amount }).catch(
      (err) => {
        // TODO: handle error
      }
    );
    if (typeof isEdited === 'boolean') {
      return isEdited;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchStakes(accessToken);
    }
  }, [accessToken, fetchStakes]);

  return (
    <StakesContext.Provider
      value={{
        editStake,
        createStake,
      }}
    >
      {children}
    </StakesContext.Provider>
  );
};

export const useStakesController = () => useContext(StakesContext);

export default StakesController;
