import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  useAppDispatch,
  clearShopError,
  setShopError,
  setShopLoading,
  setShopModal,
  setShopOffers,
  setOrdersItems,
  setShopOfferId,
  setShopOorderTransactionId,
  setShopOorderStatus,
} from '../store';
import { useUserController } from './UserController';
import {
  getAllOffers,
  addOrderRequest,
  getProviderWalletRequest,
  getOrderRequest,
  getOfferById,
} from '../services';
import { POOL_CONTRACT_ADDRESS } from '../config';
import {
  TokenType,
  OfferType,
  LiquidityWalletType,
  ChainType,
  OrderPlacingStatusType,
} from '../types';
import {
  getErrorMessage,
  getOrderIdFromReceipt,
  getChainById,
  switchMetamaskNetwork,
} from '../utils';
import { addGsheetRowRequest } from '../services/gsheetServices';

// Context props
type ContextProps = {
  handleAcceptOfferAction: (
    offer: OfferType,
    accessToken: string,
    userChainId: string,
    exchangeToken: TokenType,
    poolAbi: any,
    userAddress: string,
    chains: ChainType[]
  ) => void;
  handleEmailSubmitAction: (
    accessToken: string,
    email: string,
    orderId: string,
    walletAddress: string
  ) => Promise<boolean>;
};

export const ShopContext = createContext<ContextProps>({
  handleAcceptOfferAction: () => {},
  handleEmailSubmitAction: async () => false,
});

type ShopControllerProps = {
  children: React.ReactNode;
};

export const ShopController = ({ children }: ShopControllerProps) => {
  const dispatch = useAppDispatch();
  const { getSigner, getEthers, getProvider } = useUserController();

  const fetchOffers = useCallback(async () => {
    dispatch(setShopLoading(true));
    const items = await getAllOffers();

    if (items) {
      const promises = items.map(async (offer: OfferType) => {
        const provider = await getProviderWalletRequest(
          offer.userId || '',
          offer.chainId
        ).catch(() => {
          return null;
        });
        return provider || null;
      });
      const providers = await Promise.all(promises);
      const enrichedOffers = items.map((offer: OfferType) => ({
        ...offer,
        providerDetails:
          providers.find(
            (provider: LiquidityWalletType | null) =>
              offer && provider && offer.provider === provider.walletAddress
          ) || undefined,
      }));
      dispatch(setShopOffers(enrichedOffers));
    }

    //dispatch(setShopOffers(items || []));
    dispatch(setShopLoading(false));
  }, [dispatch]);

  const fetchSingleOrder = async (accessToken: string, id: string) => {
    let order;
    try {
      order = await getOrderRequest(accessToken, id);
    } catch (error) {
      // handle order fetching error
    }
    if (order) {
      const offer = await getOfferById(accessToken, order.offerId || '').catch(
        () => {
          // handle offer fetching error
        }
      );
      if (offer) {
        order.offer = offer;
      }
      dispatch(setOrdersItems([order]));
    }
  };

  const handleEmailSubmitAction = async (
    accessToken: string,
    email: string,
    orderId: string,
    walletAddress: string
  ): Promise<boolean> => {
    let res;
    try {
      res = await addGsheetRowRequest(accessToken, {
        email,
        walletAddress,
        orderId,
      });
    } catch (error: any) {
      console.error('handleEmailSubmitAction error:', error);
      return false;
    }
    return res;
  };

  const validateAcceptOfferAction = (offer: OfferType): boolean => {
    if (!offer.offerId) {
      dispatch(
        setShopError({
          type: 'acceptOffer',
          text: 'offer id is missing',
        })
      );

      return false;
    }

    if (!offer.amount) {
      dispatch(
        setShopError({
          type: 'acceptOffer',
          text: 'Tokens amount is missing',
        })
      );

      return false;
    }

    if (!offer.exchangeRate) {
      dispatch(
        setShopError({
          type: 'acceptOffer',
          text: 'Exchange rate is missing',
        })
      );

      return false;
    }

    if (!offer.exchangeChainId) {
      dispatch(
        setShopError({
          type: 'acceptOffer',
          text: 'Offer exchange chain is not set',
        })
      );

      return false;
    }

    return true;
  };

  const handleAcceptOfferAction = async (
    offer: OfferType,
    accessToken: string,
    userChainId: string,
    exchangeToken: TokenType,
    poolAbi: any,
    userAddress: string,
    chains: ChainType[]
  ) => {
    dispatch(clearShopError());
    dispatch(setShopOfferId(''));
    dispatch(setShopOorderTransactionId(''));
    dispatch(setShopOorderStatus(OrderPlacingStatusType.UNINITIALIZED));
    dispatch(setShopModal(true));

    if (!validateAcceptOfferAction(offer)) {
      return;
    }

    dispatch(setShopOfferId(offer.offerId));

    const inputChain = getChainById(offer.exchangeChainId || '', chains);
    if (!inputChain) {
      dispatch(
        setShopError({
          type: 'acceptOffer',
          text: 'Chain not found',
        })
      );
      dispatch(setShopOfferId(''));
      dispatch(setShopOorderStatus(OrderPlacingStatusType.ERROR));
      return;
    }
    if (userChainId !== offer.exchangeChainId) {
      dispatch(
        setShopOorderStatus(OrderPlacingStatusType.WAITING_NETWORK_SWITCH)
      );
    }
    const networkSwitched = await switchMetamaskNetwork(
      userChainId,
      inputChain
    );
    if (!networkSwitched) {
      dispatch(
        setShopError({
          type: 'acceptOffer',
          text: 'Network switching failed. Please, switch network in your MetaMask and try again.',
        })
      );
      dispatch(setShopOfferId(''));
      dispatch(setShopOorderStatus(OrderPlacingStatusType.ERROR));
      return;
    }

    dispatch(setShopOorderStatus(OrderPlacingStatusType.WAITING_CONFIRMATION));

    // get signer
    const signer = getSigner();
    const ethers = getEthers();
    const provider = getProvider();

    const amountToPay = (
      parseFloat(offer.amount || '0') * parseFloat(offer.exchangeRate || '0')
    ).toString();

    // set pool contract
    const _poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS[`eip155:${offer.exchangeChainId}`],
      poolAbi,
      signer
    );

    // connect signer
    const poolContract = _poolContract.connect(signer);

    // get gas estimation
    const gasEstimate = await poolContract.estimateGas
      .depositETHAndAcceptOffer(
        offer.offerId,
        userAddress,
        ethers.utils.parseEther(
          parseFloat(offer.amount || '0')
            .toFixed(18)
            .toString()
        ),
        {
          value: ethers.utils.parseEther(amountToPay),
        }
      )
      .catch((error: any) => {
        dispatch(
          setShopError({
            type: 'acceptOffer',
            text: getErrorMessage(error.error, 'Gas estimation error'),
          })
        );
        dispatch(setShopOfferId(''));
        dispatch(setShopOorderStatus(OrderPlacingStatusType.ERROR));
        return;
      });

    // create transaction
    const tx = await poolContract
      .depositETHAndAcceptOffer(
        offer.offerId,
        userAddress,
        ethers.utils.parseEther(
          parseFloat(offer.amount || '0')
            .toFixed(18)
            .toString()
        ),
        {
          value: ethers.utils.parseEther(amountToPay),
          gasLimit: gasEstimate,
        }
      )
      .catch((error: any) => {
        dispatch(
          setShopError({
            type: 'acceptOffer',
            text: getErrorMessage(error.error, 'Transaction rejected'),
          })
        );
        console.error('depositGRTWithOffer error', error);
        dispatch(setShopOfferId(''));
        dispatch(setShopOorderStatus(OrderPlacingStatusType.ERROR));
        return;
      });

    // stop execution if offer activation failed
    if (!tx) {
      dispatch(setShopOfferId(''));
      dispatch(setShopOorderStatus(OrderPlacingStatusType.ERROR));
      return;
    }

    // wait for activation transaction
    dispatch(setShopOorderStatus(OrderPlacingStatusType.PROCESSING));
    try {
      await tx.wait();
    } catch (error: any) {
      dispatch(
        setShopError({
          type: 'acceptOffer',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('tx.wait error', error);
      dispatch(setShopOfferId(''));
      dispatch(setShopOorderStatus(OrderPlacingStatusType.ERROR));
      return;
    }

    // get receipt
    const receipt = await provider.getTransactionReceipt(tx.hash);

    // get orderId
    const orderId = getOrderIdFromReceipt(receipt);

    // save order to DB
    const order = await addOrderRequest(accessToken, {
      amountTokenDeposit: amountToPay,
      addressTokenDeposit: exchangeToken.address,
      chainIdTokenDeposit: offer.exchangeChainId,
      destAddr: userAddress,
      offerId: offer.offerId,
      orderId,
      amountTokenOffer: offer.amount,
      hash: tx.hash || '',
    }).catch((error: any) => {
      console.error('saveOrder error', error);
      dispatch(
        setShopError({
          type: 'acceptOffer',
          text: error?.message || 'Server error',
        })
      );
      dispatch(setShopOfferId(''));
      dispatch(setShopOorderStatus(OrderPlacingStatusType.ERROR));
    });
    if (order) {
      // get created order
      try {
        fetchSingleOrder(accessToken, order);
      } catch (error: any) {
        console.error('saveOrder error', error);
        dispatch(
          setShopError({
            type: 'acceptOffer',
            text: error?.message || "Server error, order wasn't found",
          })
        );
        dispatch(setShopOfferId(''));
        dispatch(setShopOorderStatus(OrderPlacingStatusType.ERROR));
        return;
      }

      dispatch(setShopOorderTransactionId(tx.hash || ''));
      dispatch(setShopOorderStatus(OrderPlacingStatusType.COMPLETED));
    } else {
      dispatch(
        setShopError({
          type: 'acceptOffer',
          text: "Server error, order wasn't saved",
        })
      );
    }
    dispatch(setShopOfferId(''));
  };

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <ShopContext.Provider
      value={{
        handleAcceptOfferAction,
        handleEmailSubmitAction,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopController = () => useContext(ShopContext);

export default ShopController;
