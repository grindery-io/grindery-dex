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
  selectUserAccessToken,
  OffersCreateInputInputFieldName,
  clearOffersCreateInput,
  clearOffersError,
  selectOffersItems,
  setOfferCreateInputValue,
  setOffersActivating,
  setOffersError,
  setOffersItems,
  setOffersLoading,
  selectPoolAbi,
  selectChainsItems,
  selectWalletsItems,
  selectUserChainId,
  selectOffersCreateInput,
  addOffersItems,
  setOffersTotal,
} from '../store';
import {
  getTokenById,
  getOfferToChain,
  getMetaMaskErrorMessage,
  getChainById,
  switchMetamaskNetwork,
  validateOfferCreateAction,
} from '../utils';
import { useUserController } from './UserController';
import { addOffer, getOffer, getUserOffers, updateOffer } from '../services';
import { OfferType, LiquidityWalletType } from '../types';
import { ROUTES, POOL_CONTRACT_ADDRESS } from '../config';

// Context props
type ContextProps = {
  handleOfferCreateAction: () => void;
  handleOfferCreateInputChange: (
    name: OffersCreateInputInputFieldName,
    value: string
  ) => void;
  handleActivationAction: (offer: OfferType, isActive: boolean) => void;
  handleFetchMoreOffersAction: () => void;
};

export const OffersContext = createContext<ContextProps>({
  handleOfferCreateAction: () => {},
  handleOfferCreateInputChange: () => {},
  handleActivationAction: () => {},
  handleFetchMoreOffersAction: () => {},
});

type OffersControllerProps = {
  children: React.ReactNode;
};

export const OffersController = ({ children }: OffersControllerProps) => {
  let navigate = useNavigate();
  const accessToken = useAppSelector(selectUserAccessToken);
  const dispatch = useAppDispatch();
  const { getSigner, getEthers } = useUserController();
  const offers = useAppSelector(selectOffersItems);
  const wallets = useAppSelector(selectWalletsItems);
  const userChainId = useAppSelector(selectUserChainId);
  const poolAbi = useAppSelector(selectPoolAbi);
  const chains = useAppSelector(selectChainsItems);
  const input = useAppSelector(selectOffersCreateInput);
  const limit = 5;
  const [offset, setOffset] = useState(limit);

  const fetchOffers = useCallback(async () => {
    dispatch(setOffersLoading(true));
    const res = await getUserOffers(accessToken, limit);
    dispatch(setOffersItems(res?.items || []));
    dispatch(setOffersTotal(res?.total || 0));
    dispatch(setOffersLoading(false));
  }, [dispatch, accessToken]);

  const handleFetchMoreOffersAction = useCallback(async () => {
    const res = await getUserOffers(accessToken, limit, offset);
    dispatch(addOffersItems(res?.items || []));
    setOffset(offset + limit);
  }, [dispatch, accessToken, offset]);

  const fetchOffer = async (accessToken: string, id: string) => {
    const offer = await getOffer(accessToken, id);
    return offer;
  };

  const createOffer = useCallback(
    async (
      accessToken: string,
      body: { [key: string]: any }
    ): Promise<OfferType | boolean> => {
      const newOfferId = await addOffer(accessToken, body);
      if (newOfferId) {
        const offer = await fetchOffer(accessToken, newOfferId);
        if (offer) {
          return offer;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    []
  );

  const editOffer = async (
    accessToken: string,
    body: {
      offerId: string;
      isActive: boolean;
    }
  ): Promise<boolean> => {
    const isEdited = await updateOffer(accessToken, body);
    if (typeof isEdited === 'boolean') {
      return isEdited;
    } else {
      return false;
    }
  };

  const handleOfferCreateInputChange = useCallback(
    (name: OffersCreateInputInputFieldName, value: string) => {
      dispatch(clearOffersError());
      dispatch(setOfferCreateInputValue({ name, value }));
    },
    [dispatch]
  );

  const handleOfferCreateAction = useCallback(async () => {
    // clear error message
    dispatch(clearOffersError());

    // validate before executing
    const validation = validateOfferCreateAction(input);
    if (validation !== true) {
      dispatch(setOffersError(validation));
      return false;
    }

    const userWallet = wallets.find(
      (w: LiquidityWalletType) => w.chainId === input.fromChainId
    )?.walletAddress;

    if (!userWallet) {
      dispatch(
        setOffersError({
          type: 'saveOffer',
          text: 'Liquidity wallet is missing',
        })
      );
      return false;
    }

    const fromToken = getTokenById(
      input.fromTokenId,
      input.fromChainId,
      chains
    );
    const toToken = getTokenById(input.toTokenId, input.toChainId, chains);

    if (!fromToken || !toToken) {
      dispatch(
        setOffersError({
          type: 'saveOffer',
          text: 'Tokens not found',
        })
      );
      return;
    }

    // start executing
    dispatch(setOffersLoading(true));

    const inputChain = getChainById(input.toChainId || '', chains);
    if (!inputChain) {
      dispatch(
        setOffersError({
          type: 'saveOffer',
          text: 'Chain not found',
        })
      );
      dispatch(setOffersLoading(false));
      return;
    }
    const networkSwitched = await switchMetamaskNetwork(
      userChainId,
      inputChain
    );
    if (!networkSwitched) {
      dispatch(
        setOffersError({
          type: 'saveOffer',
          text: 'Network switching failed. Please, switch network in your MetaMask and try again.',
        })
      );
      dispatch(setOffersLoading(false));
      return;
    }

    const ethers = getEthers();
    const signer = getSigner();

    // set pool contract
    const _poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS[`eip155:${input.toChainId}`],
      poolAbi,
      signer
    );

    // connect signer
    const poolContract = _poolContract.connect(signer);

    // Format min and max limits
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

    // create offer transaction
    let tx;
    try {
      tx = await poolContract.setOffer(
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
    } catch (error: any) {
      dispatch(
        setOffersError({
          type: 'saveOffer',
          text: getMetaMaskErrorMessage(
            error,
            'Create offer transaction error'
          ),
        })
      );
      console.error('setOffer error', error);
      dispatch(setOffersLoading(false));
      return;
    }

    // save offer to DB
    const newOffer = await createOffer(accessToken, {
      chainId: input.fromChainId,
      min: input.amountMin,
      max: input.amountMax,
      tokenId: fromToken.coinmarketcapId,
      token: fromToken.symbol || '',
      tokenAddress: fromToken.address || '',
      hash: tx.hash || '',
      exchangeRate: input.exchangeRate || '',
      exchangeToken: toToken.symbol || 'ETH',
      exchangeChainId: input.toChainId,
      estimatedTime: input.estimatedTime || '',
      provider: userWallet || '',
      isActive: false,
      offerId: '',
      title: input.title,
      image: input.image,
      amount: input.amount,
    });

    if (newOffer && typeof newOffer !== 'boolean') {
      // update offer state
      dispatch(setOffersItems([newOffer, ...offers]));

      // clear input fields
      dispatch(clearOffersCreateInput());

      navigate(ROUTES.SELL.OFFERS.ROOT.FULL_PATH);
    } else {
      dispatch(
        setOffersError({
          type: 'saveOffer',
          text: 'Offer creation failed. Please, try again.',
        })
      );
    }

    // complete execution
    dispatch(setOffersLoading(false));
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
      dispatch(setOffersActivating(offer.offerId || ''));

      const offerToChain = getOfferToChain(offer, chains);

      if (!offerToChain) {
        dispatch(
          setOffersError({
            type: 'setIsActive',
            text: 'Chain not found',
          })
        );
        dispatch(setOffersActivating(''));
        return;
      }

      const networkSwitched = await switchMetamaskNetwork(
        userChainId,
        offerToChain
      );
      if (!networkSwitched) {
        dispatch(
          setOffersError({
            type: 'setIsActive',
            text: 'Network switching failed. Please, switch network in your MetaMask and try again.',
          })
        );
        dispatch(setOffersActivating(''));
        return;
      }

      const signer = getSigner();
      const ethers = getEthers();

      // set pool contract
      const _poolContract = new ethers.Contract(
        POOL_CONTRACT_ADDRESS['eip155:5'],
        poolAbi,
        signer
      );

      // connect signer
      const poolContract = _poolContract.connect(signer);

      const offerId = offer.offerId;

      try {
        await poolContract.getOfferer(offerId);
      } catch (error: any) {
        dispatch(
          setOffersError({
            type: 'checkOwner',
            text: getMetaMaskErrorMessage(
              error,
              'Checking offer owner transaction error'
            ),
          })
        );
        console.error('checkOwner error', error);
        dispatch(setOffersActivating(''));
        return;
      }

      // create transaction
      try {
        await poolContract.setIsActive(offerId, isActive, {
          gasLimit: 1000000,
        });
      } catch (error: any) {
        dispatch(
          setOffersError({
            type: 'setIsActive',
            text: getMetaMaskErrorMessage(
              error,
              'Offer activation transaction error'
            ),
          })
        );
        console.error('setIsActive error', error);
        dispatch(setOffersActivating(''));
        return;
      }

      const updated = await editOffer(accessToken, {
        offerId: offerId || '',
        isActive,
      });

      if (!updated) {
        // offer wasn't updated, stop execution
        dispatch(setOffersActivating(''));
        return;
      }
      dispatch(
        setOffersItems([
          ...offers.map((offer) => ({
            ...offer,
            isActive: offerId === offer.offerId ? isActive : offer.isActive,
          })),
        ])
      );
      dispatch(setOffersActivating(''));
    },
    [
      accessToken,
      userChainId,
      chains,
      poolAbi,
      offers,
      dispatch,
      getEthers,
      getSigner,
    ]
  );

  useEffect(() => {
    if (accessToken) {
      fetchOffers();
    }
  }, [accessToken, fetchOffers]);

  useEffect(() => {
    handleOfferCreateInputChange('fromChainId', '97');
    handleOfferCreateInputChange('toChainId', '5');
    handleOfferCreateInputChange('fromTokenId', '1839');
    handleOfferCreateInputChange('toTokenId', '1027');
  }, [handleOfferCreateInputChange]);

  return (
    <OffersContext.Provider
      value={{
        handleOfferCreateAction,
        handleOfferCreateInputChange,
        handleActivationAction,
        handleFetchMoreOffersAction,
      }}
    >
      {children}
    </OffersContext.Provider>
  );
};

export const useOffersController = () => useContext(OffersContext);

export default OffersController;
