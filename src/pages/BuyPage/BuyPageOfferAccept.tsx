import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import Loading from '../../components/Loading/Loading';
import useBuyPage from '../../hooks/useBuyPage';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { Offer } from '../../types/Offer';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import OfferPublic from '../../components/Offer/OfferPublic';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Countdown from 'react-countdown';
import { IconButton, Skeleton, Stack, Tooltip } from '@mui/material';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import { useGrinderyNexus } from 'use-grindery-nexus';
import AlertBox from '../../components/AlertBox/AlertBox';
import AmountInput from '../../components/AmountInput/AmountInput';
import { formatAddress } from '../../utils/address';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
  } = useBuyPage();
  const { chains } = useGrinderyChains();
  let navigate = useNavigate();
  let { offerId } = useParams();
  const [copied, setCopied] = useState(false);
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

  const explorerLink = accepted
    ? (
        chains.find((c) => c.value === `eip155:5`)?.transactionExplorerUrl || ''
      ).replace('{hash}', accepted)
    : '';

  const currentOfferChain = chains.find(
    (c) => c.value === `eip155:${offer?.chainId}`
  );
  const offerToken = {
    label:
      currentOfferChain?.tokens?.find(
        (t) => t.coinmarketcapId === offer?.tokenId
      )?.symbol || '',
    icon:
      currentOfferChain?.tokens?.find(
        (t) => t.coinmarketcapId === offer?.tokenId
      )?.icon || '',
  };

  const countdownRenderer = ({
    total,
    completed,
  }: {
    total: any;
    completed: any;
  }) => {
    if (completed) {
      // Render a completed state
      return <span>0</span>;
    } else {
      // Render a countdown
      return <span>{total / 1000}</span>;
    }
  };

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
              setAccepted('');
              setApproved(false);
              navigate(VIEWS.ROOT.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody maxHeight="540px">
        {!accepted ? (
          <>
            {/*<AmountInput
              label="You pay"
              value={parseFloat(fromAmount).toFixed(6).toLocaleString()}
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
            />*/}
            <Box mt="0px">
              <OfferPublic
                key={offer._id}
                offer={offer}
                chain={offerChain}
                token={offerToken}
                fromAmount={fromAmount}
                //label="You receive"
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
                  ? approved ||
                    (typeof fromToken !== 'string' &&
                      fromToken?.address === '0x0')
                    ? 'Place Order'
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
              <p>
                {offer.estimatedTime ? (
                  <>
                    Your order has been placed and is expected to complete
                    within{' '}
                    <Countdown
                      date={
                        Date.now() +
                        (offer.estimatedTime
                          ? parseInt(offer.estimatedTime) * 1000
                          : 0)
                      }
                      renderer={countdownRenderer}
                    />
                    {} seconds. Hang tight.
                  </>
                ) : (
                  <>
                    Your order has been placed and is expected to complete soon.
                    Hang tight.
                  </>
                )}
              </p>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                mt="10px"
                gap="4px"
              >
                <p>Transaction ID: {formatAddress(accepted)}</p>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Tooltip
                    title={copied ? 'Copied' : 'Copy to clipboard'}
                    onClose={() => {
                      setTimeout(() => {
                        setCopied(false);
                      }, 300);
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{ fontSize: '14px' }}
                      onClick={() => {
                        navigator.clipboard.writeText(accepted);
                        setCopied(true);
                      }}
                    >
                      <ContentCopyIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  {explorerLink && (
                    <Tooltip title="View on blockchain explorer">
                      <IconButton
                        size="small"
                        sx={{ fontSize: '14px' }}
                        onClick={() => {
                          window.open(explorerLink, '_blank');
                        }}
                      >
                        <OpenInNewIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>
            </AlertBox>
            <DexCardSubmitButton
              label="Close"
              onClick={() => {
                setAccepted('');
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
