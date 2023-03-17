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
  chain: string | number;
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
  setChain: React.Dispatch<React.SetStateAction<string | number>>;
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
type OffersPageContextProps = {
  children: React.ReactNode;
};

// Init context
export const OffersPageContext = createContext<ContextProps>({
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

export const OffersPageContextProvider = ({
  children,
}: OffersPageContextProps) => {
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
  const { offersAbi } = useAbi();
  const [amountMin, setAmountMin] = useState<string>('');
  const [amountMax, setAmountMax] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [chain, setChain] = useState(selectedChain || '');
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentChain: Chain | null =
    chain && chains.find((c) => c.value === chain)
      ? {
          id:
            chain && typeof chain === 'string'
              ? `0x${parseFloat(chain.split(':')[1]).toString(16)}`
              : '',
          value: chains.find((c) => c.value === chain)?.value || '',
          label: chains.find((c) => c.value === chain)?.label || '',
          icon: chains.find((c) => c.value === chain)?.icon || '',
          rpc: chains.find((c) => c.value === chain)?.rpc || [],
          nativeToken: chains.find((c) => c.value === chain)?.token || '',
        }
      : null;

  const chainTokens = (
    (chain && chains.find((c) => c.value === chain)?.tokens) ||
    []
  ).filter(
    (t: any) => !searchToken || t.symbol.toLowerCase().includes(searchToken)
  );

  const groupedOffers = _.groupBy(offers, (offer) => offer.chain);

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

    // get signer
    const signer = provider.getSigner();

    // set pool contract
    const _poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS[chain.toString()],
      offersAbi,
      signer
    );

    // connect signer
    const poolContract = _poolContract.connect(signer);

    // Format min and max limits
    const upperLimitOffer = ethers.utils.defaultAbiCoder.encode(
      ['string', 'uint256'],
      [
        `https://api.coingecko.com/api/v3/coins/${token.symbol}`,
        ethers.utils.parseEther(amountMax),
      ]
    );
    const lowerLimitOffer = ethers.utils.defaultAbiCoder.encode(
      ['string', 'uint256'],
      [
        `https://api.coingecko.com/api/v3/coins/${token.symbol}`,
        ethers.utils.parseEther(amountMin),
      ]
    );

    // create offer transaction
    const tx = await poolContract
      .setOffer(
        token.address && token.address !== '0x0'
          ? token.address
          : ethers.constants.AddressZero,
        parseFloat(chain.toString().split(':')[1]),
        ethers.constants.AddressZero,
        upperLimitOffer,
        lowerLimitOffer
      )
      .catch((error: any) => {
        setErrorMessage({
          type: 'saveOffer',
          text: getErrorMessage(error.error, 'Create offer transaction error'),
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

    const offerId = receipt?.logs?.[0]?.topics?.[0] || '';

    // save offer to DB
    const newOffer = await saveOffer({
      chain: parseFloat(chain.toString().split(':')[1]),
      min: amountMin,
      max: amountMax,
      tokenId: token.id,
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

    // get signer
    const signer = provider.getSigner();

    // set pool contract
    const _poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS[chain.toString()],
      offersAbi,
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

    const updated = await updateOffer(offerId).catch((error: any) => {
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

    /*// get signer
    const signer = provider.getSigner();

    // set pool contract
    const _poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS[chain.toString()],
      offersAbi,
      signer
    );

    // connect signer
    const poolContract = _poolContract.connect(signer);

    // create transaction
    const tx = await poolContract
      .setIsActive(offerId, true)
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
    }*/

    const updated = await updateOffer(offerId).catch((error: any) => {
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

  useEffect(() => {
    setChain(selectedChain || '');
  }, [selectedChain]);

  useEffect(() => {
    if (currentChain && currentChain.id) {
      window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: currentChain.id,
            chainName: currentChain.label,
            rpcUrls: currentChain.rpc,
            nativeCurrency: {
              name: currentChain.nativeToken,
              symbol: currentChain.nativeToken,
              decimals: 18,
            },
          },
        ],
      });
    }
  }, [currentChain]);

  return (
    <OffersPageContext.Provider
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
    </OffersPageContext.Provider>
  );
};

export default OffersPageContextProvider;
