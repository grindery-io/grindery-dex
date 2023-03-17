import React, { useEffect, useState } from 'react';
import { IconButton, ListSubheader, Tooltip } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import {
  ArrowBack as ArrowBackIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from '@mui/icons-material';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexOffer from '../../components/grindery/DexOffer/DexOffer';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexSelectChainAndTokenButton from '../../components/grindery/DexSelectChainAndTokenButton/DexSelectChainAndTokenButton';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexChainsList from '../../components/grindery/DexChainsList/DexChainsList';
import DexTokenSearch from '../../components/grindery/DexTokenSearch/DexTokenSearch';
import DexTokensList from '../../components/grindery/DexTokensList/DexTokensList';
import DexTokensNotFound from '../../components/grindery/DexTokensNotFound/DexTokensNotFound';
import { Offer } from '../../types/Offer';
import { Chain } from '../../types/Chain';
import { Route, Routes, useNavigate } from 'react-router-dom';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import useOffers from '../../hooks/useOffers';
import DexAlertBox from '../../components/grindery/DexAlertBox/DexAlertBox';
import { POOL_CONTRACT_ADDRESS } from '../../constants';
import useAbi from '../../hooks/useAbi';
import _ from 'lodash';
import DexListSubheader from '../../components/grindery/DexListSubheader/DexListSubheader';
import { getErrorMessage } from '../../utils/error';
import { TokenType } from '../../types/TokenType';

function isNumeric(value: string) {
  return /^\d*(\.\d+)?$/.test(value);
}

const VIEWS = {
  ROOT: { path: '', fullPath: '/sell/offers' },
  CREATE: { path: '/create', fullPath: '/sell/offers/create' },
  SELECT_CHAIN: {
    path: '/select-chain',
    fullPath: '/sell/offers/select-chain',
  },
};

function OffersPage() {
  const {
    user,
    connect,
    chain: selectedChain,
    provider,
    ethers,
  } = useGrinderyNexus();
  let navigate = useNavigate();
  const { offersAbi, isLoading: abiIsLoading } = useAbi();
  const [amountMin, setAmountMin] = useState<string>('');
  const [amountMax, setAmountMax] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [chain, setChain] = useState(selectedChain || '');
  const { chains, isLoading: chainsIsLoading } = useGrinderyChains();
  const [token, setToken] = useState<TokenType | ''>('');
  const [searchToken, setSearchToken] = useState('');
  const [isActivating, setIsActivating] = useState('');
  const {
    offers,
    isLoading: offersIsLoading,
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

  const handleClick = async () => {
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

    // save offer to DB
    const newOffer = await saveOffer({
      chain: parseFloat(chain.toString().split(':')[1]),
      min: amountMin,
      max: amountMax,
      tokenId: token.id,
      token: token.symbol || '',
      tokenAddress: token.address || '',
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

    // create transaction
    const tx = await poolContract
      .setIsActive(offerId, false)
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
    <>
      <DexCard>
        <Routes>
          <Route
            path={VIEWS.ROOT.path}
            element={
              <>
                <DexCardHeader
                  title="Offers"
                  endAdornment={
                    user && offers.length > 4 ? (
                      <Tooltip title="Create">
                        <IconButton
                          size="medium"
                          edge="end"
                          onClick={() => {
                            navigate(VIEWS.CREATE.fullPath);
                          }}
                        >
                          <AddCircleOutlineIcon sx={{ color: 'black' }} />
                        </IconButton>
                      </Tooltip>
                    ) : null
                  }
                />

                <DexCardBody maxHeight="540px">
                  {user &&
                    offers.length > 0 &&
                    Object.keys(groupedOffers).map((key: any) => (
                      <React.Fragment key={key}>
                        <DexListSubheader>
                          {chains.find(
                            (c: Chain) => c.value === `eip155:${key}`
                          )?.label || ''}
                        </DexListSubheader>
                        {groupedOffers[key].map((offer: Offer) => {
                          const offerChain = {
                            label:
                              chains.find(
                                (c) => c.value === `eip155:${offer.chain}`
                              )?.label || '',
                            icon:
                              chains.find(
                                (c) => c.value === `eip155:${offer.chain}`
                              )?.icon || '',
                            token:
                              chains.find(
                                (c) => c.value === `eip155:${offer.chain}`
                              )?.nativeToken || '',
                          };
                          const currentOfferChain = chains.find(
                            (c) => c.value === `eip155:${offer.chain}`
                          );
                          const offerToken = {
                            label:
                              currentOfferChain?.tokens?.find(
                                (t) => t.id === offer.tokenId
                              )?.symbol || '',
                            icon:
                              currentOfferChain?.tokens?.find(
                                (t) => t.id === offer.tokenId
                              )?.icon || '',
                          };
                          return (
                            <DexOffer
                              key={offer._id}
                              offer={offer}
                              chain={offerChain}
                              isActivating={isActivating}
                              onDeactivateClick={handleDeactivateClick}
                              onActivateClick={handleActivateClick}
                              token={offerToken}
                            />
                          );
                        })}
                      </React.Fragment>
                    ))}
                  {user && offersIsLoading && <DexLoading />}
                  <DexCardSubmitButton
                    label={user ? 'Create offer' : 'Connect wallet'}
                    onClick={
                      user
                        ? () => {
                            navigate(VIEWS.CREATE.fullPath);
                          }
                        : () => {
                            connect();
                          }
                    }
                  />
                </DexCardBody>
              </>
            }
          />
          <Route
            path={VIEWS.CREATE.path}
            element={
              <>
                <DexCardHeader
                  title="Create offer"
                  titleSize={18}
                  titleAlign="center"
                  startAdornment={
                    <IconButton
                      size="medium"
                      edge="start"
                      onClick={() => {
                        setAmountMin('');
                        setAmountMax('');
                        navigate(VIEWS.ROOT.fullPath);
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  }
                  endAdornment={<Box width={28} height={40} />}
                />

                <DexCardBody>
                  <DexSelectChainAndTokenButton
                    onClick={() => {
                      navigate(VIEWS.SELECT_CHAIN.fullPath);
                    }}
                    title="Blockchain and token"
                    chain={currentChain}
                    token={token}
                    error={errorMessage}
                  />

                  <Box display="flex" flexDirection="row" gap="16px">
                    <DexTextInput
                      label="Minimum amount"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setErrorMessage({
                          type: '',
                          text: '',
                        });
                        setAmountMin(event.target.value);
                      }}
                      name="amountMin"
                      placeholder="0"
                      disabled={false}
                      value={amountMin}
                      error={errorMessage}
                    />
                    <DexTextInput
                      label="Maximum amount"
                      value={amountMax}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setErrorMessage({
                          type: '',
                          text: '',
                        });
                        setAmountMax(event.target.value);
                      }}
                      name="amountMax"
                      placeholder="0"
                      disabled={false}
                      error={errorMessage}
                    />
                  </Box>
                  {errorMessage &&
                    errorMessage.type === 'saveOffer' &&
                    errorMessage.text && (
                      <DexAlertBox color="error">
                        <p>{errorMessage.text}</p>
                      </DexAlertBox>
                    )}
                  {loading && <DexLoading />}
                  <DexCardSubmitButton
                    label={
                      loading ? 'Loading' : user ? 'Create' : 'Connect wallet'
                    }
                    onClick={
                      user
                        ? handleClick
                        : () => {
                            connect();
                          }
                    }
                    disabled={loading}
                  />
                </DexCardBody>
              </>
            }
          />
          <Route
            path={VIEWS.SELECT_CHAIN.path}
            element={
              <>
                <DexCardHeader
                  title="Select chain and token"
                  titleSize={18}
                  titleAlign="center"
                  startAdornment={
                    <IconButton
                      size="medium"
                      edge="start"
                      onClick={() => {
                        setSearchToken('');
                        navigate(VIEWS.CREATE.fullPath);
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  }
                  endAdornment={<Box width={28} height={40} />}
                />
                <DexChainsList
                  chain={chain}
                  chains={chains}
                  onClick={(blockchain: any) => {
                    setChain(blockchain.value);
                    setToken('');
                  }}
                />
                <DexTokenSearch
                  value={searchToken}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchToken(event.target.value);
                  }}
                />

                {chain && chainTokens && chainTokens.length > 0 ? (
                  <DexTokensList
                    tokens={chainTokens}
                    onClick={(chainToken: any) => {
                      setToken(chainToken);
                      setSearchToken('');
                      setErrorMessage({
                        type: '',
                        text: '',
                      });
                      navigate(VIEWS.CREATE.fullPath);
                    }}
                  />
                ) : (
                  <DexTokensNotFound
                    text={
                      !currentChain ? (
                        <>Please, select a chain to see a list of tokens.</>
                      ) : (
                        <>
                          We couldn't find tokens{' '}
                          {currentChain
                            ? `on ${currentChain?.label} chain`
                            : ''}
                          . Please try search again or switch the chain.
                        </>
                      )
                    }
                  />
                )}
              </>
            }
          />
        </Routes>
      </DexCard>
    </>
  );
}

export default OffersPage;
