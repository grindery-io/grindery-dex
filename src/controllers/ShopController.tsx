import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
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
  setShopOrderTransactionId,
  setShopOorderStatus,
  setShopOffersTotal,
  addShopOffers,
} from '../store';
import { useUserController } from './UserController';
import { getAllOffers, addOrderRequest, getOrderRequest } from '../services';
import { POOL_CONTRACT_ADDRESS } from '../config';
import {
  TokenType,
  OfferType,
  ChainType,
  OrderPlacingStatusType,
  ErrorMessageType,
} from '../types';
import { getErrorMessage, getChainById, switchMetamaskNetwork } from '../utils';
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
  handleFetchMoreOffersAction: () => void;
};

export const ShopContext = createContext<ContextProps>({
  handleAcceptOfferAction: () => {},
  handleEmailSubmitAction: async () => false,
  handleFetchMoreOffersAction: () => {},
});

type ShopControllerProps = {
  children: React.ReactNode;
};

export const ShopController = ({ children }: ShopControllerProps) => {
  const dispatch = useAppDispatch();
  const { getSigner, getEthers } = useUserController();
  const limit = 9;
  const [offset, setOffset] = useState(limit);

  const fetchOffers = useCallback(async () => {
    dispatch(setShopLoading(true));
    const res = await getAllOffers(limit);

    dispatch(setShopOffers(res?.items || []));
    dispatch(setShopOffersTotal(res?.total || 0));
    dispatch(setShopLoading(false));
  }, [dispatch]);

  const handleFetchMoreOffersAction = useCallback(async () => {
    const res = await getAllOffers(limit, offset);
    dispatch(addShopOffers(res?.items || []));
    setOffset(offset + limit);
  }, [dispatch, offset]);

  const fetchSingleOrder = async (accessToken: string, id: string) => {
    let order;
    try {
      order = await getOrderRequest(accessToken, id);
    } catch (error) {}
    if (order) {
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

  const validateAcceptOfferAction = (
    offer: OfferType
  ): ErrorMessageType | true => {
    if (!offer.offerId) {
      return {
        type: 'acceptOffer',
        text: 'offer id is missing',
      };
    }

    if (!offer.amount) {
      return {
        type: 'acceptOffer',
        text: 'Tokens amount is missing',
      };
    }

    if (!offer.exchangeRate) {
      return {
        type: 'acceptOffer',
        text: 'Exchange rate is missing',
      };
    }

    if (!offer.exchangeChainId) {
      return {
        type: 'acceptOffer',
        text: 'Offer exchange chain is not set',
      };
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
    dispatch(setShopOrderTransactionId(''));
    dispatch(setShopOorderStatus(OrderPlacingStatusType.UNINITIALIZED));
    dispatch(setShopModal(true));

    const validation = validateAcceptOfferAction(offer);
    if (validation !== true) {
      dispatch(setShopError(validation));
      dispatch(setShopOorderStatus(OrderPlacingStatusType.ERROR));
      return;
    }

    dispatch(setShopOfferId(offer.offerId || ''));

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
    let tx;
    try {
      tx = await poolContract.depositETHAndAcceptOffer(
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
      );
    } catch (error: any) {
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
    }

    // save order to DB
    const order = await addOrderRequest(accessToken, {
      amountTokenDeposit: amountToPay,
      addressTokenDeposit: exchangeToken.address,
      chainIdTokenDeposit: offer.exchangeChainId,
      destAddr: userAddress,
      offerId: offer.offerId,
      orderId: '',
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

      dispatch(setShopOrderTransactionId(tx.hash || ''));
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
        handleFetchMoreOffersAction,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopController = () => useContext(ShopContext);

export default ShopController;
