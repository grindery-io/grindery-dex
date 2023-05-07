import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  useAppDispatch,
  useAppSelector,
  FaucetInput,
  FaucetInputFieldName,
  faucetStoreActions,
  selectUserStore,
} from '../store';
import { isNumeric, getChainIdHex } from '../utils';
import { useUserProvider } from './UserProvider';
import { GRT_CONTRACT_ADDRESS } from '../config';

type ContextProps = {
  handleGetTokensAction: (
    input: FaucetInput,
    currentChainId: string,
    tokenContractAbi: any
  ) => void;
  handleInputChange: (name: FaucetInputFieldName, value: string) => void;
};

type FaucetProviderProps = {
  children: React.ReactNode;
};

export const FaucetContext = createContext<ContextProps>({
  handleGetTokensAction: () => {},
  handleInputChange: () => {},
});

export const FaucetProvider = ({ children }: FaucetProviderProps) => {
  const dispatch = useAppDispatch();
  const { getSigner, getEthers } = useUserProvider();
  const { address: userAddress, chainId: userChain } =
    useAppSelector(selectUserStore);
  const handleInputChange = useCallback(
    (name: FaucetInputFieldName, value: string) => {
      dispatch(faucetStoreActions.clearError());
      dispatch(faucetStoreActions.setInputValue({ name, value }));
    },
    [dispatch]
  );

  const validateGetTokensAction = (input: FaucetInput) => {
    if (!input.address) {
      dispatch(
        faucetStoreActions.setError({
          type: 'address',
          text: 'Wallet address is required',
        })
      );
      return false;
    }
    if (!input.amount) {
      dispatch(
        faucetStoreActions.setError({
          type: 'amount',
          text: 'Amount is required',
        })
      );
      return false;
    }
    if (!isNumeric(input.amount)) {
      dispatch(
        faucetStoreActions.setError({
          type: 'amount',
          text: 'Must be a number',
        })
      );
      return false;
    }
    if (!input.chainId) {
      dispatch(
        faucetStoreActions.setError({
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
    dispatch(faucetStoreActions.clearError());
    dispatch(faucetStoreActions.setTransactionId(''));

    if (!validateGetTokensAction(input)) {
      return;
    }

    dispatch(faucetStoreActions.setLoading(true));

    if (input.chainId !== currentChainId || !currentChainId) {
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
        dispatch(faucetStoreActions.setLoading(false));
        return;
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

    const tx = await grtContract
      .mint(input.address, ethers.utils.parseEther(input.amount))
      .catch(() => {
        dispatch(faucetStoreActions.setLoading(false));
        dispatch(
          faucetStoreActions.setError({
            type: 'transaction',
            text: 'Transaction rejected',
          })
        );
        return;
      });

    try {
      await tx.wait();
    } catch (e) {
      dispatch(faucetStoreActions.setLoading(false));
      dispatch(
        faucetStoreActions.setError({
          type: 'transaction',
          text: 'Transaction failed',
        })
      );
      return;
    }

    dispatch(faucetStoreActions.setTransactionId(tx.hash));
    dispatch(faucetStoreActions.setLoading(false));
  };

  useEffect(() => {
    handleInputChange('address', userAddress);
  }, [userAddress, handleInputChange]);

  useEffect(() => {
    if (userChain) {
      handleInputChange('chainId', userChain.split(':').pop() || '');
    }
  }, [userChain, handleInputChange]);

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

export const useFaucetProvider = () => useContext(FaucetContext);

export default FaucetProvider;
