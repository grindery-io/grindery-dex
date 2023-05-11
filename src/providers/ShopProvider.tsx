import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useAppDispatch,
  useAppSelector,
  shopStoreActions,
  ordersStoreActions,
  selectAbiStore,
  selectChainsStore,
  selectUserStore,
} from '../store';
import { useUserProvider } from './UserProvider';
import { getAllOffers, addOrderRequest, getOrderRequest } from '../services';
import { OfferType, OrderPlacingStatusType, ErrorMessageType } from '../types';
import {
  getChainById,
  switchMetamaskNetwork,
  getTokenBySymbol,
  getMetaMaskErrorMessage,
} from '../utils';
import { addGsheetRowRequest } from '../services/gsheetServices';

// Context props
type ContextProps = {
  handleAcceptOfferAction: (offer: OfferType) => void;
  handleEmailSubmitAction: (
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

type ShopProviderProps = {
  children: React.ReactNode;
};

export const ShopProvider = ({ children }: ShopProviderProps) => {
  const dispatch = useAppDispatch();
  const { getSigner, getEthers } = useUserProvider();
  const limit = 9;
  const [offset, setOffset] = useState(limit);
  const { items: chains } = useAppSelector(selectChainsStore);
  const {
    accessToken,
    chainId: userChainId,
    address: userAddress,
  } = useAppSelector(selectUserStore);
  const { poolAbi, tokenAbi } = useAppSelector(selectAbiStore);

  const fetchOffers = useCallback(async () => {
    dispatch(shopStoreActions.setLoading(true));
    const res = await getAllOffers(limit);

    dispatch(shopStoreActions.setOffers(res?.items || []));
    dispatch(shopStoreActions.setOffersTotal(res?.total || 0));
    dispatch(shopStoreActions.setLoading(false));
  }, [dispatch]);

  const handleFetchMoreOffersAction = useCallback(async () => {
    const res = await getAllOffers(limit, offset);
    dispatch(shopStoreActions.addOffers(res?.items || []));
    setOffset(offset + limit);
  }, [dispatch, offset]);

  const fetchSingleOrder = useCallback(
    async (id: string) => {
      let order;
      try {
        order = await getOrderRequest(accessToken, id);
      } catch (error) {}
      if (order) {
        dispatch(ordersStoreActions.setItems([order]));
      }
    },
    [accessToken, dispatch]
  );

  const handleEmailSubmitAction = useCallback(
    async (
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
    },
    [accessToken]
  );

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

  const handleAcceptOfferAction = useCallback(
    async (offer: OfferType) => {
      dispatch(shopStoreActions.clearError());
      dispatch(shopStoreActions.setOfferId(''));
      dispatch(shopStoreActions.setOrderTransactionId(''));
      dispatch(
        shopStoreActions.setOrderStatus(OrderPlacingStatusType.UNINITIALIZED)
      );
      dispatch(shopStoreActions.setModal(true));

      const validation = validateAcceptOfferAction(offer);
      if (validation !== true) {
        dispatch(shopStoreActions.setError(validation));
        dispatch(shopStoreActions.setOrderStatus(OrderPlacingStatusType.ERROR));
        return;
      }

      try {
        const exchangeToken = getTokenBySymbol(
          offer.exchangeToken,
          offer.exchangeChainId,
          chains
        );

        dispatch(shopStoreActions.setOfferId(offer.offerId || ''));

        const inputChain = getChainById(offer.exchangeChainId, chains);
        if (!inputChain) {
          throw new Error('Chain not found');
        }
        if (userChainId !== offer.exchangeChainId) {
          dispatch(
            shopStoreActions.setOrderStatus(
              OrderPlacingStatusType.WAITING_NETWORK_SWITCH
            )
          );
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

        // get signer
        const signer = getSigner();
        const ethers = getEthers();

        const amountToPay = (
          parseFloat(offer.amount || '0') *
          parseFloat(offer.exchangeRate || '0')
        ).toString();

        const offerAmount = offer.amount;

        // set pool contract
        const _poolContract = new ethers.Contract(
          inputChain.usefulAddresses?.grtPoolAddress,
          poolAbi,
          signer
        );

        // connect signer
        const poolContract = _poolContract.connect(signer);

        if (exchangeToken?.address !== '0x0') {
          dispatch(
            shopStoreActions.setOrderStatus(
              OrderPlacingStatusType.WAITING_APPROVAL
            )
          );
          const _tokenContract = new ethers.Contract(
            exchangeToken?.address,
            tokenAbi,
            signer
          );

          // connect signer
          const tokenContract = _tokenContract.connect(signer);

          const approvalTx = await tokenContract.approve(
            inputChain.usefulAddresses?.grtPoolAddress,
            ethers.utils.parseEther(amountToPay)
          );

          dispatch(
            shopStoreActions.setOrderStatus(
              OrderPlacingStatusType.PROCESSING_APPROVAL
            )
          );
          // wait for approval transaction
          await approvalTx.wait();
        }

        dispatch(
          shopStoreActions.setOrderStatus(
            OrderPlacingStatusType.WAITING_CONFIRMATION
          )
        );

        let tx;

        if (exchangeToken?.address !== '0x0') {
          const gasEstimate =
            await poolContract.estimateGas.depositTestTokenAndAcceptOffer(
              exchangeToken?.address,
              ethers.utils.parseEther(amountToPay),
              offer.offerId,
              userAddress,
              ethers.utils.parseEther(offerAmount)
            );

          tx = await poolContract.depositTestTokenAndAcceptOffer(
            exchangeToken?.address,
            ethers.utils.parseEther(amountToPay),
            offer.offerId,
            userAddress,
            ethers.utils.parseEther(offerAmount),
            {
              gasLimit: gasEstimate,
            }
          );
        } else {
          const gasEstimate =
            await poolContract.estimateGas.depositETHAndAcceptOffer(
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
            );

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
        }

        // save order to DB
        const order = await addOrderRequest(accessToken, {
          amountTokenDeposit: amountToPay,
          addressTokenDeposit: exchangeToken?.address || '',
          chainIdTokenDeposit: offer.exchangeChainId,
          destAddr: userAddress,
          offerId: offer.offerId,
          orderId: '',
          amountTokenOffer: offer.amount,
          hash: tx.hash || '',
        });
        if (order) {
          fetchSingleOrder(order);
          dispatch(shopStoreActions.setOrderTransactionId(tx.hash || ''));
          dispatch(
            shopStoreActions.setOrderStatus(OrderPlacingStatusType.COMPLETED)
          );
        } else {
          dispatch(
            shopStoreActions.setError({
              type: 'acceptOffer',
              text: "Server error, order wasn't saved",
            })
          );
        }
      } catch (error: any) {
        dispatch(
          shopStoreActions.setError({
            type: 'acceptOffer',
            text:
              getMetaMaskErrorMessage(error) ||
              'Server error, please try again later.',
          })
        );
        dispatch(shopStoreActions.setOrderStatus(OrderPlacingStatusType.ERROR));
      }
      dispatch(shopStoreActions.setOfferId(''));
    },
    [
      accessToken,
      userChainId,
      poolAbi,
      userAddress,
      chains,
      tokenAbi,
      dispatch,
      fetchSingleOrder,
      getEthers,
      getSigner,
    ]
  );

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

export const useShopProvider = () => useContext(ShopContext);

export default ShopProvider;
