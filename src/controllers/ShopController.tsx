import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useAppDispatch, useAppSelector } from '../store/storeHooks';
import { selectUserAccessToken } from '../store/slices/userSlice';
import { getChainIdHex } from '../utils/helpers/chainHelpers';
import { useUserController } from './UserController';
import { getAllOffers } from '../services/offerServices';
import { OfferType } from '../types/OfferType';
import { POOL_CONTRACT_ADDRESS } from '../config/constants';
import { getErrorMessage } from '../utils/error';
import {
  clearShopError,
  selectShopFilter,
  setShopAcceptedOffer,
  setShopAcceptedOfferTx,
  setShopAccepting,
  setShopApproved,
  setShopError,
  setShopFromTokenPrice,
  setShopLoading,
  setShopModal,
  setShopOffers,
  setShopPricesLoading,
} from '../store/slices/shopSlice';
import { getTokenPriceById } from '../services/tokenServices';
import { TokenType } from '../types/TokenType';
import { getOrderIdFromReceipt } from '../utils/helpers/orderHelpers';
import { addOrder } from '../services/orderServices';

// Context props
type ContextProps = {
  handleAcceptOfferAction: (
    offer: OfferType,
    accessToken: string,
    userChainId: string,
    approved: boolean,
    exchangeToken: TokenType,
    tokenAbi: any,
    poolAbi: any,
    userAddress: string
  ) => void;
};

export const ShopContext = createContext<ContextProps>({
  handleAcceptOfferAction: () => {},
});

type ShopControllerProps = {
  children: React.ReactNode;
};

export const ShopController = ({ children }: ShopControllerProps) => {
  const accessToken = useAppSelector(selectUserAccessToken);
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectShopFilter);
  const { fromTokenId } = filter;
  const { getSigner, getEthers, getProvider } = useUserController();

  const fetchOffers = useCallback(
    async (accessToken: string) => {
      dispatch(setShopLoading(true));
      const items = await getAllOffers(accessToken);
      dispatch(setShopOffers(items || []));
      dispatch(setShopLoading(false));
    },
    [dispatch]
  );

  const fetchFromTokenPrice = useCallback(
    async (accessToken: string, tokenId: string) => {
      dispatch(setShopPricesLoading(true));
      const price = await getTokenPriceById(accessToken, tokenId);
      dispatch(setShopFromTokenPrice(price));
      dispatch(setShopPricesLoading(false));
    },
    [dispatch]
  );

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
    approved: boolean,
    exchangeToken: TokenType,
    tokenAbi: any,
    poolAbi: any,
    userAddress: string
  ) => {
    dispatch(clearShopError());
    dispatch(setShopAccepting(''));
    dispatch(setShopModal(true));

    if (!validateAcceptOfferAction(offer)) {
      return;
    }

    dispatch(setShopAccepting(offer.offerId));

    // switch chain if needed
    if (!userChainId || userChainId !== offer.exchangeChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: getChainIdHex(offer.exchangeChainId || ''),
            },
          ],
        });
      } catch (error: any) {
        // TODO: handle chain switching error
      }
    }

    // get signer
    const signer = getSigner();
    const ethers = getEthers();
    const provider = getProvider();

    const amountToPay = (
      parseFloat(offer.amount || '0') * parseFloat(offer.exchangeRate || '0')
    ).toString();

    // approve tokens first
    if (!approved && exchangeToken.address !== '0x0') {
      // set token contract
      const _fromTokenContract = new ethers.Contract(
        exchangeToken.address,
        tokenAbi,
        signer
      );

      // connect signer
      const fromTokenContract = _fromTokenContract.connect(signer);

      // approve tokens
      const txApprove = await fromTokenContract
        .approve(
          POOL_CONTRACT_ADDRESS[`eip155:${offer.exchangeChainId}`],
          ethers.utils.parseEther(amountToPay)
        )
        .catch((error: any) => {
          dispatch(
            setShopError({
              type: 'acceptOffer',
              text: getErrorMessage(error.error, 'Approval transaction error'),
            })
          );
          console.error('approve error', error.error);
          dispatch(setShopAccepting(''));
          return;
        });

      // stop executing if approval failed
      if (!txApprove) {
        dispatch(setShopAccepting(''));
        return;
      }

      // wait for approval transaction
      try {
        await txApprove.wait();
      } catch (error: any) {
        dispatch(
          setShopError({
            type: 'acceptOffer',
            text: error?.message || 'Transaction error',
          })
        );
        console.error('txApprove.wait error', error);
        dispatch(setShopAccepting(''));
        return;
      }
      dispatch(setShopAccepting(''));
      dispatch(setShopApproved(true));

      // accept if tokens were approved
    } else {
      // set pool contract
      const _poolContract = new ethers.Contract(
        POOL_CONTRACT_ADDRESS[`eip155:${offer.exchangeChainId}`],
        poolAbi,
        signer
      );

      // connect signer
      const poolContract = _poolContract.connect(signer);

      // get gas estimation
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
              text: getErrorMessage(
                error.error,
                'Accepting offer transaction error'
              ),
            })
          );
          console.error('depositGRTWithOffer error', error);
          dispatch(setShopAccepting(''));
          return;
        });

      // stop execution if offer activation failed
      if (!tx) {
        dispatch(setShopAccepting(''));
        return;
      }

      // wait for activation transaction
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
        dispatch(setShopAccepting(''));
        return;
      }

      // get receipt
      const receipt = await provider.getTransactionReceipt(tx.hash);

      // get orderId
      const orderId = getOrderIdFromReceipt(receipt);

      // save order to DB
      const order = await addOrder(accessToken, {
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
      });
      if (order) {
        dispatch(setShopApproved(false));
        dispatch(setShopAcceptedOffer(offer.offerId));
        dispatch(setShopAcceptedOfferTx(tx.hash || ''));
      } else {
        dispatch(
          setShopError({
            type: 'acceptOffer',
            text: "Server error, order wasn't saved",
          })
        );
      }
      dispatch(setShopAccepting(''));
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchOffers(accessToken);
    }
  }, [accessToken, fetchOffers]);

  useEffect(() => {
    if (accessToken && fromTokenId) {
      fetchFromTokenPrice(accessToken, fromTokenId);
    }
  }, [accessToken, fetchFromTokenPrice, fromTokenId]);

  return (
    <ShopContext.Provider
      value={{
        handleAcceptOfferAction,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopController = () => useContext(ShopContext);

export default ShopController;
