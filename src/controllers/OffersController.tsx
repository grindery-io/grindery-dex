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
import {
  OffersCreateInput,
  OffersCreateInputInputFieldName,
  clearOffersCreateInput,
  clearOffersError,
  selectOffersItems,
  setOfferCreateInputValue,
  setOffersActivating,
  setOffersError,
  setOffersItems,
  setOffersLoading,
} from '../store/slices/offersSlice';
import { addOffer, getOffer, getUserOffers, updateOffer } from '../services';
import { OfferType } from '../types/OfferType';
import { isNumeric } from '../utils';
import { POOL_CONTRACT_ADDRESS } from '../config/constants';
import { ChainType } from '../types/ChainType';
import { getTokenById } from '../utils/helpers/tokenHelpers';
import { getErrorMessage } from '../utils/error';
import {
  getOfferIdFromReceipt,
  getOfferToChain,
} from '../utils/helpers/offerHelpers';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';

// Context props
type ContextProps = {
  handleOfferCreateAction: (
    input: OffersCreateInput,
    accessToken: string,
    userChainId: string,
    userWallet: string,
    poolAbi: any,
    chains: ChainType[]
  ) => void;
  handleOfferCreateInputChange: (
    name: OffersCreateInputInputFieldName,
    value: string
  ) => void;
  handleActivationAction: (
    accessToken: string,
    offer: OfferType,
    isActive: boolean,
    userChain: string,
    chains: ChainType[],
    poolAbi: any
  ) => void;
};

export const OffersContext = createContext<ContextProps>({
  handleOfferCreateAction: () => {},
  handleOfferCreateInputChange: () => {},
  handleActivationAction: () => {},
});

type OffersControllerProps = {
  children: React.ReactNode;
};

export const OffersController = ({ children }: OffersControllerProps) => {
  const accessToken = useAppSelector(selectUserAccessToken);
  const dispatch = useAppDispatch();
  const { getSigner, getEthers, getProvider } = useUserController();
  const offers = useAppSelector(selectOffersItems);
  let navigate = useNavigate();

  const fetchOffers = useCallback(
    async (accessToken: string) => {
      dispatch(setOffersLoading(true));
      const items = await getUserOffers(accessToken);
      dispatch(setOffersItems(items || []));
      dispatch(setOffersLoading(false));
    },
    [dispatch]
  );

  const fetchOffer = async (accessToken: string, id: string) => {
    const offer = await getOffer(accessToken, id).catch((err) => {
      // TODO: handle error
    });
    return offer;
  };

  const createOffer = async (
    accessToken: string,
    body: { [key: string]: any }
  ): Promise<OfferType | boolean> => {
    const newOfferId = await addOffer(accessToken, body).catch((err) => {
      // TODO: handle error
    });
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
  };

  const editOffer = async (
    accessToken: string,
    body: {
      offerId: string;
      isActive: boolean;
    }
  ): Promise<boolean> => {
    const isEdited = await updateOffer(accessToken, body).catch((err) => {
      // TODO: handle error
    });
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

  const validateOfferCreateAction = (input: OffersCreateInput) => {
    if (!input.fromChainId || !input.fromTokenId) {
      dispatch(
        setOffersError({
          type: 'chain',
          text: 'Chain and token are required',
        })
      );
      return false;
    }
    if (!input.toChainId || !input.toTokenId) {
      dispatch(
        setOffersError({
          type: 'toChain',
          text: 'Chain and token are required',
        })
      );
      return false;
    }
    if (!input.exchangeRate) {
      dispatch(
        setOffersError({
          type: 'exchangeRate',
          text: 'Exchange rate is required',
        })
      );
      return false;
    }
    if (!isNumeric(input.exchangeRate)) {
      dispatch(
        setOffersError({
          type: 'exchangeRate',
          text: 'Must be a number',
        })
      );
      return false;
    }
    if (!input.amountMin) {
      dispatch(
        setOffersError({
          type: 'amountMin',
          text: 'Min amount is required',
        })
      );
      return false;
    }
    if (!isNumeric(input.amountMin)) {
      dispatch(
        setOffersError({
          type: 'amountMin',
          text: 'Must be a number',
        })
      );
      return;
    }
    if (!input.amountMax) {
      dispatch(
        setOffersError({
          type: 'amountMax',
          text: 'Max amount is required',
        })
      );
      return false;
    }
    if (!isNumeric(input.amountMax)) {
      dispatch(
        setOffersError({
          type: 'amountMax',
          text: 'Must be a number',
        })
      );
      return false;
    }
    if (parseFloat(input.amountMax) <= parseFloat(input.amountMin)) {
      dispatch(
        setOffersError({
          type: 'amountMax',
          text: 'Must be greater than min',
        })
      );
      return false;
    }

    if (!input.estimatedTime) {
      dispatch(
        setOffersError({
          type: 'estimatedTime',
          text: 'Execution time is required',
        })
      );
      return false;
    }
    if (!isNumeric(input.estimatedTime)) {
      dispatch(
        setOffersError({
          type: 'estimatedTime',
          text: 'Must be a number',
        })
      );
      return false;
    }
    return true;
  };

  const handleOfferCreateAction = async (
    input: OffersCreateInput,
    accessToken: string,
    userChainId: string,
    userWallet: string,
    poolAbi: any,
    chains: ChainType[]
  ) => {
    // clear error message
    dispatch(clearOffersError());

    // validate before executing
    if (!validateOfferCreateAction(input)) {
      return;
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

    if (input.toChainId !== userChainId || !userChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: getChainIdHex(input.toChainId),
            },
          ],
        });
      } catch (error: any) {
        dispatch(setOffersLoading(false));
        return;
      }
    }

    const ethers = getEthers();
    const signer = getSigner();
    const provider = getProvider();

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
    const tx = await poolContract
      .setOffer(
        fromToken.address && fromToken.address !== '0x0'
          ? fromToken.address
          : ethers.constants.AddressZero,
        parseFloat(input.fromChainId),
        upperLimitOffer,
        lowerLimitOffer,
        {
          gasLimit: 1000000,
        }
      )
      .catch((error: any) => {
        dispatch(
          setOffersError({
            type: 'saveOffer',
            text: getErrorMessage(error, 'Create offer transaction error'),
          })
        );
        console.error('setOffer error', error);
        dispatch(setOffersLoading(false));
        return;
      });

    // stop execution if offer creation failed
    if (!tx) {
      dispatch(
        setOffersError({
          type: 'saveOffer',
          text: 'Create offer transaction error',
        })
      );
      dispatch(setOffersLoading(false));
      return;
    }

    // wait for offer transaction
    try {
      await tx.wait();
    } catch (error: any) {
      dispatch(
        setOffersError({
          type: 'saveOffer',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('tx.wait error', error);
      dispatch(setOffersLoading(false));
      return;
    }

    /*const abiCoder = new ethers.utils.AbiCoder();
    const data = abiCoder.decode(['uint', 'tuple(uint256, string)'], tx.data);*/

    const receipt = await provider.getTransactionReceipt(tx.hash);

    const offerId = getOfferIdFromReceipt(receipt);

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
      offerId: offerId,
      isActive: true,
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
  };

  const handleActivationAction = async (
    accessToken: string,
    offer: OfferType,
    isActive: boolean,
    userChain: string,
    chains: ChainType[],
    poolAbi: any
  ) => {
    dispatch(setOffersActivating(offer.offerId));

    const offerToChain = getOfferToChain(offer, chains);

    if (!offerToChain) {
      // handle chain not found error
      return;
    }
    if (offerToChain.chainId !== userChain || !userChain) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: getChainIdHex(offerToChain.chainId),
            },
          ],
        });
      } catch (error: any) {
        // handle chain switching error
        return;
      }
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
          text: getErrorMessage(
            error.error,
            'Checking offer owner transaction error'
          ),
        })
      );
      console.error('checkOwner error', error);
      dispatch(setOffersActivating(''));
      return;
    }

    // create transaction
    const tx = await poolContract
      .setIsActive(offerId, isActive, {
        gasLimit: 1000000,
      })
      .catch((error: any) => {
        dispatch(
          setOffersError({
            type: 'setIsActive',
            text: getErrorMessage(
              error.error,
              'Offer activation transaction error'
            ),
          })
        );
        console.error('setIsActive error', error);
        dispatch(setOffersActivating(''));
        return;
      });

    // stop execution if offer deactivation failed
    if (!tx) {
      dispatch(setOffersActivating(''));
      return;
    }

    // wait for deactivation transaction
    try {
      await tx.wait();
    } catch (error: any) {
      dispatch(
        setOffersError({
          type: 'setIsActive',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('tx.wait error', error);
      dispatch(setOffersActivating(''));
      return;
    }

    const updated = await editOffer(accessToken, { offerId, isActive }).catch(
      (error: any) => {
        // handle error
      }
    );
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
  };

  useEffect(() => {
    if (accessToken) {
      fetchOffers(accessToken);
    }
  }, [accessToken, fetchOffers]);

  useEffect(() => {
    handleOfferCreateInputChange('fromChainId', '97');
    handleOfferCreateInputChange('toChainId', '5');
    handleOfferCreateInputChange('fromTokenId', '1839');
    handleOfferCreateInputChange('toTokenId', '1027');
  }, []);

  return (
    <OffersContext.Provider
      value={{
        handleOfferCreateAction,
        handleOfferCreateInputChange,
        handleActivationAction,
      }}
    >
      {children}
    </OffersContext.Provider>
  );
};

export const useOffersController = () => useContext(OffersContext);

export default OffersController;
