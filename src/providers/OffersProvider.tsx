import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
  OffersCreateInputInputFieldName,
  selectAbiStore,
  selectChainsStore,
  selectOffersStore,
  offersStoreActions,
  selectWalletsStore,
  selectUserStore,
} from '../store';
import {
  getTokenById,
  getOfferToChain,
  getMetaMaskErrorMessage,
  getChainById,
  switchMetamaskNetwork,
  validateOfferCreateAction,
} from '../utils';
import { useUserProvider } from './UserProvider';
import {
  activationOfferRequest,
  addOffer,
  getOffer,
  getUserOffers,
  refreshOffersRequest,
} from '../services';
import { OfferType, LiquidityWalletType } from '../types';
import { ROUTES } from '../config';
import { enqueueSnackbar } from 'notistack';

// Context props
type ContextProps = {
  handleOfferCreateAction: () => void;
  handleOfferCreateInputChange: (
    name: OffersCreateInputInputFieldName,
    value: string
  ) => void;
  handleActivationAction: (offer: OfferType, isActive: boolean) => void;
  handleFetchMoreOffersAction: () => void;
  handleOffersRefreshAction: () => void;
};

export const OffersContext = createContext<ContextProps>({
  handleOfferCreateAction: () => {},
  handleOfferCreateInputChange: () => {},
  handleActivationAction: () => {},
  handleFetchMoreOffersAction: () => {},
  handleOffersRefreshAction: () => {},
});

type OffersProviderProps = {
  children: React.ReactNode;
};

export const OffersProvider = ({ children }: OffersProviderProps) => {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accessToken, chainId: userChainId } = useAppSelector(selectUserStore);
  const { getSigner, getEthers } = useUserProvider();
  const { items: offers, input, error } = useAppSelector(selectOffersStore);
  const { items: wallets } = useAppSelector(selectWalletsStore);
  const { poolAbi } = useAppSelector(selectAbiStore);
  const { items: chains } = useAppSelector(selectChainsStore);
  const limit = 5;
  const [offset, setOffset] = useState(limit);

  const fetchOffers = useCallback(async () => {
    dispatch(offersStoreActions.setLoading(true));
    const res = await getUserOffers(accessToken, limit);
    dispatch(offersStoreActions.setItems(res?.items || []));
    dispatch(offersStoreActions.setTotal(res?.total || 0));
    dispatch(offersStoreActions.setLoading(false));
  }, [dispatch, accessToken]);

  const handleFetchMoreOffersAction = useCallback(async () => {
    const res = await getUserOffers(accessToken, limit, offset);
    dispatch(offersStoreActions.addItems(res?.items || []));
    setOffset(offset + limit);
  }, [dispatch, accessToken, offset]);

  const fetchOffer = useCallback(
    async (id: string) => {
      const offer = await getOffer(accessToken, id);
      return offer;
    },
    [accessToken]
  );

  const createOffer = useCallback(
    async (
      accessToken: string,
      body: { [key: string]: any }
    ): Promise<OfferType | boolean> => {
      const newOfferId = await addOffer(accessToken, body);
      if (newOfferId) {
        const offer = await fetchOffer(newOfferId);
        if (offer) {
          return offer;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    [fetchOffer]
  );

  const handleOfferCreateInputChange = useCallback(
    (name: OffersCreateInputInputFieldName, value: string) => {
      dispatch(offersStoreActions.clearError());
      dispatch(offersStoreActions.setInputValue({ name, value }));
    },
    [dispatch]
  );

  const handleOffersRefreshAction = useCallback(async () => {
    dispatch(offersStoreActions.setRefreshing(true));
    const refreshedOffers = await refreshOffersRequest(accessToken).catch(
      (error: any) => {
        dispatch(offersStoreActions.setRefreshing(false));
      }
    );
    if (refreshedOffers) {
      for (const offer of refreshedOffers) {
        dispatch(offersStoreActions.updateItem(offer));
      }
    }
    dispatch(offersStoreActions.setRefreshing(false));
  }, [accessToken, dispatch]);

  const handleOfferCreateAction = useCallback(async () => {
    dispatch(offersStoreActions.clearError());

    const validation = validateOfferCreateAction(input);
    if (validation !== true) {
      dispatch(offersStoreActions.setError(validation));
      return false;
    }

    try {
      const userWallet = wallets.find(
        (w: LiquidityWalletType) => w.chainId === input.fromChainId
      )?.walletAddress;

      if (!userWallet) {
        throw new Error('Liquidity wallet is missing');
      }

      const fromToken = getTokenById(
        input.fromTokenId,
        input.fromChainId,
        chains
      );
      const toToken = getTokenById(input.toTokenId, input.toChainId, chains);

      if (!fromToken || !toToken) {
        throw new Error('Tokens not found');
      }

      dispatch(offersStoreActions.setLoading(true));

      const inputChain = getChainById(input.toChainId || '', chains);
      if (!inputChain) {
        throw new Error('Chain not found');
      }

      const networkSwitched = await switchMetamaskNetwork(
        userChainId,
        inputChain
      );
      if (!networkSwitched) {
        throw new Error(
          'Network switching failed. Please, switch network in your MetaMask and try again.'
        );
      }

      const ethers = getEthers();
      const signer = getSigner();

      const _poolContract = new ethers.Contract(
        inputChain.usefulAddresses?.grtPoolAddress,
        poolAbi,
        signer
      );

      const poolContract = _poolContract.connect(signer);

      const upperLimitOffer = ethers.utils.defaultAbiCoder.encode(
        ['string', 'string'],
        [
          `https://api.coingecko.com/api/v3/coins/${
            fromToken?.symbol || input.fromTokenId
          }`,
          ethers.utils.parseEther(input.amountMax).toString(),
        ]
      );
      const lowerLimitOffer = ethers.utils.defaultAbiCoder.encode(
        ['string', 'string'],
        [
          `https://api.coingecko.com/api/v3/coins/${
            fromToken?.symbol || input.fromTokenId
          }`,
          ethers.utils.parseEther(input.amountMin).toString(),
        ]
      );

      const tx = await poolContract.setOffer(
        fromToken.address && fromToken.address !== '0x0'
          ? fromToken.address
          : ethers.constants.AddressZero,
        parseFloat(input.fromChainId),
        upperLimitOffer,
        lowerLimitOffer,
        {
          gasLimit: 1000000,
        }
      );

      const newOffer = await createOffer(accessToken, {
        chainId: input.fromChainId,
        min: input.amountMin,
        max: input.amountMax,
        tokenId: fromToken.coinmarketcapId,
        token: fromToken.symbol || '',
        tokenAddress: fromToken.address || '',
        hash: tx.hash || '',
        exchangeRate: input.exchangeRate || '',
        exchangeToken: toToken.symbol || '',
        exchangeChainId: input.toChainId,
        estimatedTime: input.estimatedTime || '',
        provider: userWallet || '',
        offerId: '',
        title: input.title,
        image: input.image,
        amount: input.amount,
      });

      if (newOffer && typeof newOffer !== 'boolean') {
        dispatch(offersStoreActions.setItems([newOffer, ...offers]));
        dispatch(offersStoreActions.clearInput());
        navigate(ROUTES.SELL.OFFERS.ROOT.FULL_PATH);
      } else {
        dispatch(
          offersStoreActions.setError({
            type: 'saveOffer',
            text: 'Offer creation failed. Please, try again.',
          })
        );
      }
    } catch (error: any) {
      dispatch(
        offersStoreActions.setError({
          type: 'saveOffer',
          text: getMetaMaskErrorMessage(
            error,
            'Offer creation failed. Please, try again.'
          ),
        })
      );
    }

    dispatch(offersStoreActions.setLoading(false));
  }, [
    accessToken,
    poolAbi,
    chains,
    wallets,
    userChainId,
    input,
    offers,
    createOffer,
    dispatch,
    getEthers,
    getSigner,
    navigate,
  ]);

  const handleActivationAction = useCallback(
    async (offer: OfferType, isActive: boolean) => {
      dispatch(offersStoreActions.setActivating(offer.offerId || ''));

      try {
        const offerToChain = getOfferToChain(offer, chains);
        if (!offerToChain) {
          throw new Error('Chain not found.');
        }

        const networkSwitched = await switchMetamaskNetwork(
          userChainId,
          offerToChain
        );
        if (!networkSwitched) {
          throw new Error(
            'Network switching failed. Please, switch network in your MetaMask and try again.'
          );
        }

        const signer = getSigner();
        const ethers = getEthers();

        const _poolContract = new ethers.Contract(
          offerToChain.usefulAddresses?.grtPoolAddress,
          poolAbi,
          signer
        );

        const poolContract = _poolContract.connect(signer);

        const offerId = offer.offerId;

        //await poolContract.getOfferer(offerId);

        const tx = await poolContract.setIsActiveOffer(offerId, isActive, {
          gasLimit: 1000000,
        });

        const updated = await activationOfferRequest(accessToken, {
          offerId: offerId || '',
          activating: isActive,
          hash: tx.hash,
        });
        if (!updated) {
          throw new Error(
            'Server error: offer activation request failed. Please, try again.'
          );
        }
        const updatedOffer = await getOffer(accessToken, offer._id);
        dispatch(offersStoreActions.updateItem(updatedOffer));
      } catch (error: any) {
        dispatch(
          offersStoreActions.setError({
            type: 'setIsActive',
            text: getMetaMaskErrorMessage(error, 'Offer activation error'),
          })
        );
      }
      dispatch(offersStoreActions.setActivating(''));
    },
    [accessToken, userChainId, chains, poolAbi, dispatch, getEthers, getSigner]
  );

  useEffect(() => {
    if (accessToken) {
      fetchOffers();
    }
  }, [accessToken, fetchOffers]);

  /*useEffect(() => {
    if (!input.fromChainId) {
      handleOfferCreateInputChange('fromChainId', '97');
    }
    if (!input.fromTokenId) {
      handleOfferCreateInputChange('fromTokenId', '1839');
    }
    if (!input.toChainId) {
      handleOfferCreateInputChange('toChainId', '5');
    }
    if (!input.toTokenId) {
      handleOfferCreateInputChange('toTokenId', '1027');
    }
  }, [input, handleOfferCreateInputChange]);*/

  useEffect(() => {
    if (error && error.text) {
      enqueueSnackbar(error.text, {
        variant: 'error',
      });
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(offersStoreActions.setError({ type: '', text: '' }));
    };
  }, [dispatch]);

  return (
    <OffersContext.Provider
      value={{
        handleOfferCreateAction,
        handleOfferCreateInputChange,
        handleActivationAction,
        handleFetchMoreOffersAction,
        handleOffersRefreshAction,
      }}
    >
      {children}
    </OffersContext.Provider>
  );
};

export const useOffersProvider = () => useContext(OffersContext);

export default OffersProvider;
