import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import Loading from '../../components/Loading/Loading';
import useBuyPage from '../../hooks/useBuyPage';
import DexCardBody from '../../components/DexCard/DexCardBody';
import NotFound from '../../components/NotFound/NotFound';
import { Offer } from '../../types/Offer';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import OfferPublic from '../../components/Offer/OfferPublic';
import OfferSkeleton from '../../components/Offer/OfferSkeleton';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { CircularProgress, IconButton, Skeleton, Tooltip } from '@mui/material';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import { useGrinderyNexus } from 'use-grindery-nexus';
import AlertBox from '../../components/AlertBox/AlertBox';
import AmountInput from '../../components/AmountInput/AmountInput';

type Props = {};

const BuyPageOfferAccept = (props: Props) => {
  const { user, connect } = useGrinderyNexus();
  const {
    VIEWS,
    loading,
    foundOffers,
    accepted,
    approved,
    handleAcceptOfferClick,
    setAccepted,
    setApproved,
    errorMessage,
    fromAmount,
    fromChain,
    fromToken,
    toTokenPrice,
    fromTokenPrice,
    isPricesLoading,
    handleRefreshOffersClick,
  } = useBuyPage();
  const { chains } = useGrinderyChains();
  let navigate = useNavigate();
  let { offerId } = useParams();
  const offer = foundOffers.find((o: Offer) => o.offerId === offerId);
  const offerChain = {
    label:
      chains.find((c) => c.value === `eip155:${offer?.chainId}`)?.label || '',
    icon:
      chains.find((c) => c.value === `eip155:${offer?.chainId}`)?.icon || '',
    token:
      chains.find((c) => c.value === `eip155:${offer?.chainId}`)?.nativeToken ||
      '',
  };
  const currentOfferChain = chains.find(
    (c) => c.value === `eip155:${offer?.chainId}`
  );
  const offerToken = {
    label:
      currentOfferChain?.tokens?.find((t) => t.id === offer?.tokenId)?.symbol ||
      '',
    icon:
      currentOfferChain?.tokens?.find((t) => t.id === offer?.tokenId)?.icon ||
      '',
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((_progress) => (_progress >= 100 ? 0 : _progress + 100 / 60));
    }, 1000);

    return () => {
      clearInterval(timer);
      setProgress(0);
    };
  }, []);

  useEffect(() => {
    if (progress === 0 && !loading && !accepted) {
      handleRefreshOffersClick();
    }
  }, [progress, loading, accepted]);

  return offer ? (
    <DexCard>
      <DexCardHeader
        title="Review offer"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              setAccepted(false);
              setApproved(false);
              navigate(VIEWS.ROOT.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={
          !accepted ? (
            <Box ml="auto">
              <Tooltip title={isPricesLoading ? 'Refreshing...' : 'Refresh'}>
                <IconButton
                  sx={{ marginRight: '-8px', position: 'realtive' }}
                  onClick={() => {
                    setProgress(0);
                  }}
                >
                  <CircularProgress
                    size={20}
                    variant="determinate"
                    value={100}
                    sx={{
                      color: 'rgba(0,0,0,0.1)',
                    }}
                  />
                  <CircularProgress
                    size={20}
                    variant={isPricesLoading ? undefined : 'determinate'}
                    value={isPricesLoading ? undefined : progress}
                    sx={{
                      color: '#3f49e1',
                      position: 'absolute',
                      left: '8px',
                      top: '8px',
                      zIndex: 2,
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box width={28} height={40} />
          )
        }
      />
      <DexCardBody maxHeight="540px">
        {!accepted ? (
          <>
            <AmountInput
              label="You pay"
              value={fromAmount}
              onChange={() => {}}
              name="fromAmount"
              disabled={true}
              error={errorMessage}
              placeholder="0"
              chain={fromChain}
              token={fromToken}
              disableTopMargin
              helpText={
                fromToken && typeof fromToken !== 'string' ? (
                  <span style={{ whiteSpace: 'pre-wrap' }}>{`${
                    fromToken?.symbol
                  } on ${fromChain?.label} chain\n1 ${
                    fromToken?.symbol
                  } = $${fromTokenPrice?.toLocaleString()}`}</span>
                ) : (
                  <Skeleton />
                )
              }
            />
            <Box mt="20px">
              <OfferPublic
                key={offer._id}
                offer={offer}
                chain={offerChain}
                token={offerToken}
                fromAmount={fromAmount}
                label="You receive"
                toTokenPrice={toTokenPrice}
                fromTokenPrice={fromTokenPrice}
              />
            </Box>
            {approved && (
              <AlertBox color="success">
                <p>
                  Tokens have been approved.
                  <br />
                  You can accept offer now.
                </p>
              </AlertBox>
            )}
            {loading && <Loading />}
            {errorMessage &&
              errorMessage.type === 'acceptOffer' &&
              errorMessage.text && (
                <AlertBox color="error">
                  <p>{errorMessage.text}</p>
                </AlertBox>
              )}
            <DexCardSubmitButton
              label={
                user
                  ? approved
                    ? 'Accept offer'
                    : 'Approve tokens'
                  : 'Connect wallet'
              }
              onClick={
                user
                  ? () => {
                      handleAcceptOfferClick(offer);
                    }
                  : () => {
                      connect();
                    }
              }
              disabled={Boolean(user) && loading}
            />
          </>
        ) : (
          <>
            <AlertBox color="success">
              <p>Offer has been accepted.</p>
            </AlertBox>
            <DexCardSubmitButton
              label="Close"
              onClick={() => {
                setAccepted(false);
                setApproved(false);
                navigate(VIEWS.ROOT.fullPath);
              }}
            />
          </>
        )}
      </DexCardBody>
    </DexCard>
  ) : (
    <Navigate to="/buy" />
  );
};

export default BuyPageOfferAccept;
