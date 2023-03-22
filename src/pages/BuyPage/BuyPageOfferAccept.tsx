import React from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import useBuyPage from '../../hooks/useBuyPage';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexTokensNotFound from '../../components/grindery/DexTokensNotFound/DexTokensNotFound';
import { Offer } from '../../types/Offer';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import DexOfferPublic from '../../components/grindery/DexOffer/DexOfferPublic';
import DexOfferSkeleton from '../../components/grindery/DexOffer/DexOfferSkeleton';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import { useGrinderyNexus } from 'use-grindery-nexus';
import DexAlertBox from '../../components/grindery/DexAlertBox/DexAlertBox';
import DexAmountInput from '../../components/grindery/DexAmountInput/DexAmountInput';

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
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody maxHeight="540px">
        {!accepted ? (
          <>
            <DexAmountInput
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
                <span
                  style={{ whiteSpace: 'pre-wrap' }}
                >{`GRT on ${fromChain?.label} chain\n1 GRT = $1`}</span>
              }
            />
            <Box mt="20px">
              <DexOfferPublic
                key={offer._id}
                offer={offer}
                chain={offerChain}
                token={offerToken}
                grt={fromAmount}
                label="You receive"
                tokenPrice={toTokenPrice}
              />
            </Box>
            {approved && (
              <DexAlertBox color="success">
                <p>
                  Tokens have been approved.
                  <br />
                  You can accept offer now.
                </p>
              </DexAlertBox>
            )}
            {loading && <DexLoading />}
            {errorMessage &&
              errorMessage.type === 'acceptOffer' &&
              errorMessage.text && (
                <DexAlertBox color="error">
                  <p>{errorMessage.text}</p>
                </DexAlertBox>
              )}
            <DexCardSubmitButton
              label={
                loading
                  ? 'Waiting transaction'
                  : user
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
            <DexAlertBox color="success">
              <p>Offer has been accepted.</p>
            </DexAlertBox>
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
