import React, { createContext, useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/storeHooks';
import {
  FaucetInput,
  clearFaucetError,
  setFaucetTransactionId,
  setFaucetLoading,
  setFaucetError,
  setFaucetInputValue,
  FaucetInputFieldName,
  clearFaucetInput,
} from '../store/slices/faucetSlice';
import isNumeric from '../utils/isNumeric';
import { useUserController } from './UserController';
import { GRT_CONTRACT_ADDRESS } from '../constants';
import {
  selectUserAddress,
  selectUserChainId,
} from '../store/slices/userSlice';

type ContextProps = {
  handleGetTokensAction: (
    input: FaucetInput,
    currentChainId: string,
    tokenContractAbi: any
  ) => void;
  handleInputChange: (name: FaucetInputFieldName, value: string) => void;
};

type FaucetControllerProps = {
  children: React.ReactNode;
};

export const FaucetContext = createContext<ContextProps>({
  handleGetTokensAction: () => {},
  handleInputChange: () => {},
});

export const FaucetController = ({ children }: FaucetControllerProps) => {
  const dispatch = useAppDispatch();
  const { getSigner, getEthers } = useUserController();
  const userAddress = useAppSelector(selectUserAddress);
  const userChain = useAppSelector(selectUserChainId);

  const handleInputChange = (name: FaucetInputFieldName, value: string) => {
    dispatch(clearFaucetError);
    dispatch(setFaucetInputValue({ name, value }));
  };

  const validateGetTokensAction = (input: FaucetInput) => {
    if (!input.address) {
      dispatch(
        setFaucetError({
          type: 'address',
          text: 'Wallet address is required',
        })
      );
      return false;
    }
    if (!input.amount) {
      dispatch(
        setFaucetError({
          type: 'amount',
          text: 'Amount is required',
        })
      );
      return false;
    }
    if (!isNumeric(input.amount)) {
      dispatch(
        setFaucetError({
          type: 'amount',
          text: 'Must be a number',
        })
      );
      return false;
    }
    if (!input.chainId) {
      dispatch(
        setFaucetError({
          type: 'chain',
          text: 'Blockchain is required',
        })
      );
      return false;
    }

    return true;
  };

  const handleGetTokensAction = async (
    input: FaucetInput,
    currentChainId: string,
    tokenContractAbi: any
  ) => {
    dispatch(clearFaucetError);
    dispatch(setFaucetTransactionId(''));

    if (!validateGetTokensAction(input)) {
      return;
    }

    dispatch(setFaucetLoading(true));

    if (input.chainId !== currentChainId || !currentChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: `0x${parseFloat(input.chainId).toString(16)}`,
            },
          ],
        });
      } catch (error: any) {
        // handle change switching error
      }
    }
    const ethers = getEthers();
    const signer = getSigner();

    const _grtContract = new ethers.Contract(
      GRT_CONTRACT_ADDRESS[`eip155:${input.chainId}`],
      tokenContractAbi,
      signer
    );

    const grtContract = _grtContract.connect(signer);

    const tx = await grtContract.mint(
      input.address,
      ethers.utils.parseEther(input.amount)
    );
    try {
      await tx.wait();
    } catch (e) {
      dispatch(setFaucetLoading(false));
      dispatch(
        setFaucetError({
          type: 'transaction',
          text: 'Transaction failed',
        })
      );
      return;
    }

    dispatch(setFaucetTransactionId(tx.hash));
    dispatch(setFaucetLoading(false));
    dispatch(clearFaucetInput);
  };

  useEffect(() => {
    handleInputChange('address', userAddress);
  }, [userAddress]);

  useEffect(() => {
    if (userChain) {
      handleInputChange('chainId', userChain.split(':').pop() || '');
    }
  }, [userChain]);

  return (
    <FaucetContext.Provider
      value={{
        handleGetTokensAction,
        handleInputChange,
      }}
    >
      {children}
    </FaucetContext.Provider>
  );
};

export const useFaucetController = () => useContext(FaucetContext);

export default FaucetController;
