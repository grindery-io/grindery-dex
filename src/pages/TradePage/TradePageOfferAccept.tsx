import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import Loading from '../../components/Loading/Loading';
import useTradePage from '../../hooks/useTradePage';
import DexCardBody from '../../components/DexCard/DexCardBody';
import OfferPublic from '../../components/Offer/OfferPublic';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Countdown from 'react-countdown';
import { IconButton, Stack, Tooltip } from '@mui/material';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import { useGrinderyNexus } from 'use-grindery-nexus';
import AlertBox from '../../components/AlertBox/AlertBox';
import { formatAddress } from '../../utils/address';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { OfferType } from '../../types/OfferType';

type Props = {};

const TradePageOfferAccept = (props: Props) => {
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
  } = useTradePage();
  const chains = useAppSelector(selectChainsItems);
  let navigate = useNavigate();
  let { offerId } = useParams();
  const [copied, setCopied] = useState(false);
  const offer = foundOffers.find((o: OfferType) => o.offerId === offerId);
  const offerChain = chains.find((c) => c.value === `eip155:${offer?.chainId}`);

  const explorerLink = accepted
    ? (
        chains.find((c) => c.value === `eip155:5`)?.transactionExplorerUrl || ''
      ).replace('{hash}', accepted)
    : '';

  const offerToken = offerChain?.tokens?.find(
    (t) => t.coinmarketcapId === offer?.tokenId
  );

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
              {offerChain && offerToken && (
                <OfferPublic
                  key={offer._id}
                  offer={offer}
                  fromAmount={fromAmount}
                  fromChain={fromChain}
                  fromToken={fromToken}
                  label="You receive"
                  fromLabel="You pay"
                  userType="a"
                />
              )}
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

export default TradePageOfferAccept;
