import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  useAppDispatch,
  useAppSelector,
  selectUserAccessToken,
  StakeCreateInput,
  StakeCreateInputFieldName,
  StakeWithdrawInput,
  StakeWithdrawInputFieldName,
  clearStakesError,
  selectStakesItems,
  setStakesApproved,
  setStakesCreateInputValue,
  setStakesError,
  setStakesItems,
  setStakesLoading,
  setStakesWithdrawInputValue,
} from '../store';
import { addStake, getStake, getUserStakes, updateStake } from '../services';
import { StakeType } from '../types';
import { getErrorMessage, isNumeric, getChainIdHex } from '../utils';
import { useUserController } from './UserController';
import { ROUTES, GRT_CONTRACT_ADDRESS, POOL_CONTRACT_ADDRESS } from '../config';
import { useNavigate } from 'react-router-dom';

// Context props
type ContextProps = {
  handleStakeCreateAction: (
    input: StakeCreateInput,
    currentChainId: string,
    approved: boolean,
    tokenAbi: any,
    poolAbi: any
  ) => void;
  handleCreateInputChange: (
    name: StakeCreateInputFieldName,
    value: string
  ) => void;
  handleWithdrawInputChange: (
    name: StakeWithdrawInputFieldName,
    value: string
  ) => void;
  handleStakeWithdrawAction: (
    input: StakeWithdrawInput,
    selectedStake: StakeType,
    userChainId: string,
    poolAbi: any
  ) => void;
};

export const StakesContext = createContext<ContextProps>({
  handleStakeCreateAction: () => {},
  handleCreateInputChange: () => {},
  handleWithdrawInputChange: () => {},
  handleStakeWithdrawAction: () => {},
});

type StakesControllerProps = {
  children: React.ReactNode;
};

export const StakesController = ({ children }: StakesControllerProps) => {
  const accessToken = useAppSelector(selectUserAccessToken);
  const dispatch = useAppDispatch();
  const stakes = useAppSelector(selectStakesItems);
  const { getSigner, getEthers } = useUserController();
  let navigate = useNavigate();
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

  const handleCreateInputChange = useCallback(
    (name: StakeCreateInputFieldName, value: string) => {
      dispatch(clearStakesError());
      dispatch(setStakesCreateInputValue({ name, value }));
    },
    [dispatch]
  );

  const handleWithdrawInputChange = useCallback(
    (name: StakeWithdrawInputFieldName, value: string) => {
      dispatch(clearStakesError());
      dispatch(setStakesWithdrawInputValue({ name, value }));
    },
    [dispatch]
  );

  const validatehandleStakeCreateAction = (input: StakeCreateInput) => {
    if (!input.chainId) {
      dispatch(
        setStakesError({
          type: 'chain',
          text: 'Blockchain is required',
        })
      );
      return false;
    }
    if (!input.amount) {
      dispatch(
        setStakesError({
          type: 'amount',
          text: 'Amount is required',
        })
      );
      return false;
    }
    if (!isNumeric(input.amount)) {
      dispatch(
        setStakesError({
          type: 'amount',
          text: 'Must be a number',
        })
      );
      return false;
    }

    return true;
  };

  const handleStakeCreateAction = async (
    input: StakeCreateInput,
    userChainId: string,
    approved: boolean,
    tokenAbi: any,
    poolAbi: any
  ) => {
    // clear error message
    dispatch(clearStakesError());

    // validate before executing
    if (!validatehandleStakeCreateAction(input)) {
      return;
    }

    // start executing
    dispatch(setStakesLoading(true));

    if (input.chainId !== userChainId || !userChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: getChainIdHex(input.chainId),
            },
          ],
        });
      } catch (error: any) {
        dispatch(setStakesLoading(false));
        return;
      }
    }
    const ethers = getEthers();
    const signer = getSigner();

    // approve tokens first
    if (!approved) {
      // set GRT contract
      const _grtContract = new ethers.Contract(
        GRT_CONTRACT_ADDRESS[`eip155:${input.chainId}`],
        tokenAbi,
        signer
      );

      // connect signer
      const grtContract = _grtContract.connect(signer);

      // approve GRT
      const txApprove = await grtContract
        .approve(
          POOL_CONTRACT_ADDRESS[`eip155:${input.chainId}`],
          ethers.utils.parseEther(input.amount)
        )
        .catch((error: any) => {
          dispatch(
            setStakesError({
              type: 'transaction',
              text: getErrorMessage(error, 'Approval transaction error'),
            })
          );
          console.error('approve error', error);
          dispatch(setStakesLoading(false));
          return;
        });

      // stop executing if approval failed
      if (!txApprove) {
        dispatch(setStakesLoading(false));
        return;
      }

      // wait for approval transaction
      try {
        await txApprove.wait();
      } catch (error: any) {
        dispatch(
          setStakesError({
            type: 'transaction',
            text: error?.message || 'Transaction error',
          })
        );
        console.error('txApprove.wait error', error);
        dispatch(setStakesLoading(false));
        return;
      }
      dispatch(setStakesLoading(false));
      dispatch(setStakesApproved(true));

      // stake if tokens were approved
    } else {
      // set pool contract
      const _poolContract = new ethers.Contract(
        POOL_CONTRACT_ADDRESS[`eip155:${input.chainId}`],
        poolAbi,
        signer
      );

      // connect signer
      const poolContract = _poolContract.connect(signer);

      // stake GRT
      const tx = await poolContract
        .stakeGRT(
          ethers.utils.parseEther(input.amount),
          parseFloat(input.chainId)
        )
        .catch((error: any) => {
          dispatch(
            setStakesError({
              type: 'transaction',
              text: getErrorMessage(error, 'Staking transaction error'),
            })
          );
          console.error('stakeGRT error', error);
          dispatch(setStakesLoading(false));
          return;
        });

      // stop execution if stake failed
      if (!tx) {
        dispatch(setStakesLoading(false));
        return;
      }

      // wait for stake transaction
      try {
        await tx.wait();
      } catch (error: any) {
        dispatch(
          setStakesError({
            type: 'transaction',
            text: error?.message || 'Transaction error',
          })
        );
        console.error('tx.wait error', error);
        dispatch(setStakesLoading(false));
        return;
      }

      // Add new stake if stake for the chain doesn't exist
      if (![...stakes].map((stake) => stake.chainId).includes(input.chainId)) {
        const newStake = await createStake(accessToken, {
          chainId: input.chainId,
          amount: input.amount,
        });
        if (newStake && typeof newStake !== 'boolean') {
          // update stakes state
          dispatch(
            setStakesItems([
              {
                ...newStake,
                new: true,
              },
              ...[...stakes],
            ])
          );
        } else {
          // TODO: handle error
        }
      } else {
        // update existing stake if stake for the chain exists
        const stakeUpdated = await editStake(accessToken, {
          chainId: input.chainId,
          amount: (
            parseInt(
              stakes.find((s: StakeType) => s.chainId === input.chainId)
                ?.amount || '0'
            ) + parseInt(input.amount)
          ).toString(),
        });
        if (stakeUpdated) {
          // update stakes state
          dispatch(
            setStakesItems(
              [...stakes].map((stake: StakeType) => {
                if (stake.chainId === input.chainId) {
                  return {
                    ...stake,
                    amount: (
                      parseInt(stake.amount) + parseInt(input.amount)
                    ).toString(),
                    updated: true,
                  };
                }
                return stake;
              })
            )
          );
        } else {
          // TODO: handle error
        }
      }

      // clear amount field
      dispatch(setStakesCreateInputValue({ name: 'amount', value: '' }));

      // complete execution
      dispatch(setStakesLoading(false));
      dispatch(setStakesApproved(false));

      // change view
      navigate(ROUTES.SELL.STAKING.ROOT.FULL_PATH);
    }
  };

  const validatehandleStakeWithdrawAction = (
    input: StakeWithdrawInput,
    selectedStakeId: string
  ): boolean => {
    // validate data
    if (!input.amount) {
      dispatch(
        setStakesError({
          type: 'amount',
          text: 'Amount is required',
        })
      );
      return false;
    }
    if (!isNumeric(input.amount)) {
      dispatch(
        setStakesError({
          type: 'amount',
          text: 'Must be a number',
        })
      );
      return false;
    }
    if (
      parseFloat(input.amount) >
      parseFloat(stakes.find((s) => selectedStakeId === s._id)?.amount || '0')
    ) {
      dispatch(
        setStakesError({
          type: 'amount',
          text: `You can withdraw maximum ${
            stakes.find((s) => selectedStakeId === s._id)?.amount
          } tokens`,
        })
      );
      return false;
    }
    return true;
  };

  const handleStakeWithdrawAction = async (
    input: StakeWithdrawInput,
    selectedStake: StakeType,
    userChainId: string,
    poolAbi: any
  ) => {
    // clear error message
    dispatch(clearStakesError());

    // validate before executing
    if (!validatehandleStakeWithdrawAction(input, selectedStake._id)) {
      return;
    }

    // start executing
    dispatch(setStakesLoading(true));

    if (!userChainId || selectedStake.chainId !== userChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: getChainIdHex(selectedStake.chainId),
            },
          ],
        });
      } catch (error: any) {
        // TODO handle change switching error
      }
    }

    const ethers = getEthers();
    const signer = getSigner();

    // set pool contract
    const _poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS[`eip155:${selectedStake.chainId}`],
      poolAbi,
      signer
    );

    // connect signer
    const poolContract = _poolContract.connect(signer);

    // unstake GRT
    const tx = await poolContract
      .unstakeGRT(
        ethers.utils.parseEther(input.amount),
        parseFloat(selectedStake.chainId)
      )
      .catch((error: any) => {
        dispatch(
          setStakesError({
            type: 'transaction',
            text: getErrorMessage(error, 'Withdrawal transaction error'),
          })
        );
        console.error('unstakeGRT error', error);
        dispatch(setStakesLoading(false));
        return;
      });

    // stop execution if unstake failed
    if (!tx) {
      dispatch(setStakesLoading(false));
      return;
    }

    // wait for unstake transaction
    try {
      await tx.wait();
    } catch (error: any) {
      dispatch(
        setStakesError({
          type: 'transaction',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('tx.wait error', error);
      dispatch(setStakesLoading(false));
      return;
    }

    const stakeUpdated = await editStake(accessToken, {
      chainId: selectedStake.chainId,
      amount: (
        parseFloat(
          stakes.find((s: StakeType) => s._id === selectedStake._id)?.amount ||
            '0'
        ) - parseFloat(input.amount)
      ).toString(),
    });
    if (stakeUpdated) {
      // update stakes state
      dispatch(
        setStakesItems([
          ...stakes.map((s: StakeType) => {
            if (s._id === selectedStake._id) {
              return {
                ...s,
                amount: (
                  parseFloat(s.amount) - parseFloat(input.amount)
                ).toString(),
                updated: true,
              };
            } else {
              return s;
            }
          }),
        ])
      );
    } else {
      // TODO handle error
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
        handleStakeCreateAction,
        handleCreateInputChange,
        handleWithdrawInputChange,
        handleStakeWithdrawAction,
      }}
    >
      {children}
    </StakesContext.Provider>
  );
};

export const useStakesController = () => useContext(StakesContext);

export default StakesController;
