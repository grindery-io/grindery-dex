import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Chain } from '../types/Chain';
import { useNavigate } from 'react-router-dom';
import useGrinderyChains from '../hooks/useGrinderyChains';
import useOffers from '../hooks/useOffers';
import { POOL_CONTRACT_ADDRESS } from '../constants';
import useAbi from '../hooks/useAbi';
import _ from 'lodash';
import { getErrorMessage } from '../utils/error';
import { TokenType } from '../types/TokenType';
import { Offer } from '../types/Offer';

function isNumeric(value: string) {
  return /^\d*(\.\d+)?$/.test(value);
}

// Context props
type ContextProps = {
  amountMin: string;
  amountMax: string;
  loading: boolean;
  errorMessage: { type: string; text: string };
  chain: string;
  token: TokenType | '';
  searchToken: string;
  isActivating: string;
  currentChain: Chain | null;
  chainTokens: TokenType[];
  groupedOffers: { [key: string]: Offer[] };
  setAmountMin: React.Dispatch<React.SetStateAction<string>>;
  setAmountMax: React.Dispatch<React.SetStateAction<string>>;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<{ type: string; text: string }>
  >;
  setChain: React.Dispatch<React.SetStateAction<string>>;
  setToken: React.Dispatch<React.SetStateAction<TokenType | ''>>;
  setSearchToken: React.Dispatch<React.SetStateAction<string>>;
  handleDeactivateClick: (offerId: string) => void;
  handleActivateClick: (offerId: string) => void;
  handleCreateClick: () => void;
  VIEWS: {
    [key: string]: {
      path: string;
      fullPath: string;
    };
  };
};

// Context provider props
type OrdersPageContextProps = {
  children: React.ReactNode;
};

// Init context
export const OrdersPageContext = createContext<ContextProps>({
  amountMin: '',
  amountMax: '',
  loading: false,
  errorMessage: { type: '', text: '' },
  chain: '',
  token: '',
  searchToken: '',
  isActivating: '',
  currentChain: null,
  chainTokens: [],
  groupedOffers: {},
  setAmountMin: () => {},
  setAmountMax: () => {},
  setErrorMessage: () => {},
  setChain: () => {},
  setToken: () => {},
  setSearchToken: () => {},
  handleDeactivateClick: () => {},
  handleActivateClick: () => {},
  handleCreateClick: () => {},
  VIEWS: {},
});

export const OrdersPageContextProvider = ({
  children,
}: OrdersPageContextProps) => {
  const VIEWS = {
    ROOT: { path: '', fullPath: '/sell/offers' },
    CREATE: { path: '/create', fullPath: '/sell/offers/create' },
    SELECT_CHAIN: {
      path: '/select-chain',
      fullPath: '/sell/offers/select-chain',
    },
  };

  const { chain: selectedChain, provider, ethers } = useGrinderyNexus();
  let navigate = useNavigate();
  const { poolAbi } = useAbi();
  const [amountMin, setAmountMin] = useState<string>('');
  const [amountMax, setAmountMax] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [chain, setChain] = useState('');
  const { chains } = useGrinderyChains();
  const [token, setToken] = useState<TokenType | ''>('');
  const [searchToken, setSearchToken] = useState('');
  const [isActivating, setIsActivating] = useState('');
  const {
    offers,
    setOffers,
    saveOffer,
    error: offersError,
    updateOffer,
  } = useOffers();
  const filteredChain = chains.find((c) => c.value === chain);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentChain: Chain | null =
    chain && filteredChain
      ? {
          ...(filteredChain || {}),
          idHex:
            chain && typeof chain === 'string'
              ? `0x${parseFloat(chain.split(':')[1]).toString(16)}`
              : '',
          value: filteredChain?.value || '',
          label: filteredChain?.label || '',
          icon: filteredChain?.icon || '',
          rpc: filteredChain?.rpc || [],
          nativeToken: filteredChain?.token || '',
        }
      : null;

  const chainTokens = (
    (chain && chains.find((c) => c.value === chain)?.tokens) ||
    []
  ).filter(
    (t: any) => !searchToken || t.symbol.toLowerCase().includes(searchToken)
  );

  const groupedOffers = _.groupBy(offers, (offer) => offer.chainId);

  const handleCreateClick = async () => {
    // clear error message
    setErrorMessage({
      type: '',
      text: '',
    });

    // validate offer
    if (!chain || !token) {
      setErrorMessage({
        type: 'chain',
        text: 'Chain and token are required',
      });
      return;
    }
    if (!amountMin) {
      setErrorMessage({
        type: 'amountMin',
        text: 'Min amount is required',
      });
      return;
    }
    if (!isNumeric(amountMin)) {
      setErrorMessage({
        type: 'amountMin',
        text: 'Must be a number',
      });
      return;
    }
    if (!amountMax) {
      setErrorMessage({
        type: 'amountMax',
        text: 'Max amount is required',
      });
      return;
    }
    if (!isNumeric(amountMax)) {
      setErrorMessage({
        type: 'amountMax',
        text: 'Must be a number',
      });
      return;
    }
    if (parseFloat(amountMax) <= parseFloat(amountMin)) {
      setErrorMessage({
        type: 'amountMax',
        text: 'Must be greater than min',
      });
      return;
    }
    // end validation

    // start executing
    setLoading(true);

    if (selectedChain !== 'eip155:5') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: `0x${parseFloat('5').toString(16)}`,
            },
          ],
        });
      } catch (error: any) {
        // handle change switching error
      }
    }

    // get signer
    const signer = provider.getSigner();

    // set pool contract
    const _poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS[`eip155:5`],
      poolAbi,
      signer
    );

    // connect signer
    const poolContract = _poolContract.connect(signer);

    // Format min and max limits
    const upperLimitOffer = ethers.utils.defaultAbiCoder.encode(
      ['string', 'string'],
      [
        `https://api.coingecko.com/api/v3/coins/${token.symbol}`,
        ethers.utils.parseEther(amountMax).toString(),
      ]
    );
    const lowerLimitOffer = ethers.utils.defaultAbiCoder.encode(
      ['string', 'string'],
      [
        `https://api.coingecko.com/api/v3/coins/${token.symbol}`,
        ethers.utils.parseEther(amountMin).toString(),
      ]
    );

    // create offer transaction
    const tx = await poolContract
      .setOffer(
        token.address && token.address !== '0x0'
          ? token.address
          : ethers.constants.AddressZero,
        parseFloat(chain.toString().split(':')[1]),
        upperLimitOffer,
        lowerLimitOffer,
        {
          gasLimit: 1000000,
        }
      )
      .catch((error: any) => {
        setErrorMessage({
          type: 'saveOffer',
          text: getErrorMessage(error, 'Create offer transaction error'),
        });
        console.error('setOffer error', error);
        setLoading(false);
        return;
      });

    // stop execution if offer creation failed
    if (!tx) {
      setLoading(false);
      return;
    }

    // wait for offer transaction
    try {
      await tx.wait();
    } catch (error: any) {
      setErrorMessage({
        type: 'saveOffer',
        text: error?.message || 'Transaction error',
      });
      console.error('tx.wait error', error);
      setLoading(false);
      return;
    }

    /*const abiCoder = new ethers.utils.AbiCoder();
    const data = abiCoder.decode(['uint', 'tuple(uint256, string)'], tx.data);*/

    const receipt = await provider.getTransactionReceipt(tx.hash);

    const offerId = receipt?.logs?.[0]?.topics?.[1] || '';

    // save offer to DB
    const newOffer = await saveOffer({
      chainId: chain.toString().split(':')[1],
      min: amountMin,
      max: amountMax,
      tokenId: token.coinmarketcapId,
      token: token.symbol || '',
      tokenAddress: token.address || '',
      hash: tx.hash || '',
      offerId: offerId,
      isActive: true,
    });

    if (newOffer && typeof newOffer !== 'boolean') {
      // update offer state
      setOffers([{ ...newOffer, new: true }, ...offers]);

      // clear input fields
      setAmountMin('');
      setAmountMax('');
      setToken('');
      setSearchToken('');

      // complete execution
      setLoading(false);
      navigate(VIEWS.ROOT.fullPath);
    } else {
      setErrorMessage({
        type: 'saveOffer',
        text: offersError || 'Offer creation failed. Please, try again.',
      });
      setLoading(false);
      return;
    }
  };

  const handleDeactivateClick = async (offerId: string) => {
    setIsActivating(offerId);

    const offerChain = offers.find((o: Offer) => o._id === offerId)?.chainId;

    const chainToSelect = chains.find(
      (c: Chain) => c.value === `eip155:${offerChain}`
    );

    if (!chainToSelect) {
      // handle chain not found error
      return;
    }
    if (selectedChain !== `eip155:5`) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: `0x${parseFloat('5').toString(16)}`,
            },
          ],
        });
      } catch (error: any) {
        // handle chain switching error
        return;
      }
    }

    // get signer
    const signer = provider.getSigner();

    // set pool contract
    const _poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS['eip155:5'],
      poolAbi,
      signer
    );

    // connect signer
    const poolContract = _poolContract.connect(signer);

    const offerToDeactivate = offers.find(
      (o: Offer) => o._id === offerId
    )?.offerId;

    if (!offerToDeactivate) {
      setErrorMessage({
        type: 'setIsActive',
        text: 'Offer ID not found',
      });
      setIsActivating('');
      return;
    }

    const checkOwner = await poolContract
      .getOfferer(offerToDeactivate)
      .catch((error: any) => {
        setErrorMessage({
          type: 'checkOwner',
          text: getErrorMessage(
            error.error,
            'Checking offer owner transaction error'
          ),
        });
        console.error('checkOwner error', error);
        setIsActivating('');
        return;
      });

    // create transaction
    const tx = await poolContract
      .setIsActive(offerToDeactivate, false, {
        gasLimit: 1000000,
      })
      .catch((error: any) => {
        setErrorMessage({
          type: 'setIsActive',
          text: getErrorMessage(
            error.error,
            'Deactivating offer transaction error'
          ),
        });
        console.error('setIsActive error', error);
        setIsActivating('');
        return;
      });

    // stop execution if offer deactivation failed
    if (!tx) {
      setIsActivating('');
      return;
    }

    // wait for deactivation transaction
    try {
      await tx.wait();
    } catch (error: any) {
      setErrorMessage({
        type: 'setIsActive',
        text: error?.message || 'Transaction error',
      });
      console.error('tx.wait error', error);
      setIsActivating('');
      return;
    }

    const updated = await updateOffer(offerToDeactivate).catch((error: any) => {
      // handle error
    });
    if (!updated) {
      // offer wasn't updated, stop execution
      setIsActivating('');
      return;
    }
    setOffers([
      ...offers.map((offer) => ({
        ...offer,
        isActive: offerId === offer._id ? false : offer.isActive,
      })),
    ]);
    setIsActivating('');
  };

  const handleActivateClick = async (offerId: string) => {
    setIsActivating(offerId);

    const offerChain = offers.find((o: Offer) => o._id === offerId)?.chainId;

    const chainToSelect = chains.find(
      (c: Chain) => c.value === `eip155:${offerChain}`
    );

    if (!chainToSelect) {
      // handle chain not found error
      return;
    }

    if (selectedChain !== `eip155:5`) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: `0x${parseFloat('5').toString(16)}`,
            },
          ],
        });
      } catch (error: any) {
        // handle chain switching error
        return;
      }
    }

    const offerToActivate = offers.find(
      (o: Offer) => o._id === offerId
    )?.offerId;

    if (!offerToActivate) {
      setErrorMessage({
        type: 'setIsActive',
        text: 'Offer ID not found',
      });
      setIsActivating('');
      return;
    }

    // get signer
    const signer = provider.getSigner();

    // set pool contract
    const _poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS['eip155:5'],
      poolAbi,
      signer
    );

    // connect signer
    const poolContract = _poolContract.connect(signer);

    // create transaction
    const tx = await poolContract
      .setIsActive(offerToActivate, true)
      .catch((error: any) => {
        setErrorMessage({
          type: 'setIsActive',
          text: getErrorMessage(
            error.error,
            'Activating offer transaction error'
          ),
        });
        console.error('setIsActive error', error);
        setIsActivating('');
        return;
      });

    // stop execution if offer activation failed
    if (!tx) {
      setIsActivating('');
      return;
    }

    // wait for activation transaction
    try {
      await tx.wait();
    } catch (error: any) {
      setErrorMessage({
        type: 'setIsActive',
        text: error?.message || 'Transaction error',
      });
      console.error('tx.wait error', error);
      setIsActivating('');
      return;
    }

    const updated = await updateOffer(offerToActivate).catch((error: any) => {
      // handle error
    });
    if (!updated) {
      // offer wasn't updated, stop execution
      setIsActivating('');
      return;
    }
    setOffers([
      ...offers.map((offer) => ({
        ...offer,
        isActive: offerId === offer._id ? true : offer.isActive,
      })),
    ]);
    setIsActivating('');
  };

  /*useEffect(() => {
    setChain(selectedChain || '');
  }, [selectedChain]);*/

  return (
    <OrdersPageContext.Provider
      value={{
        amountMin,
        amountMax,
        loading,
        errorMessage,
        chain,
        token,
        searchToken,
        isActivating,
        currentChain,
        chainTokens,
        groupedOffers,
        setAmountMin,
        setAmountMax,
        setErrorMessage,
        setChain,
        setToken,
        setSearchToken,
        handleDeactivateClick,
        handleActivateClick,
        handleCreateClick,
        VIEWS,
      }}
    >
      {children}
    </OrdersPageContext.Provider>
  );
};

export default OrdersPageContextProvider;
