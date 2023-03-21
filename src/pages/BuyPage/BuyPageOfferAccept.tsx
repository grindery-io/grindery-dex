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

type Props = {};

const BuyPageOfferAccept = (props: Props) => {
  const { user, connect } = useGrinderyNexus();
  const { VIEWS, loading, foundOffers } = useBuyPage();
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
        title="Accept offer"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(VIEWS.ROOT.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={
          loading ? (
            <Box ml="auto">
              <DexLoading size={20} style={{ margin: '0' }} />
            </Box>
          ) : (
            <Box width={28} height={40} />
          )
        }
      />
      <DexCardBody maxHeight="540px">
        <DexOfferPublic
          key={offer._id}
          offer={offer}
          chain={offerChain}
          token={offerToken}
        />
        <DexCardSubmitButton
          label={user ? 'Accept offer' : 'Connect wallet'}
          onClick={
            user
              ? () => {}
              : () => {
                  connect();
                }
          }
          disabled={Boolean(user) && loading}
        />
      </DexCardBody>
    </DexCard>
  ) : (
    <Navigate to="/buy" />
  );
};

export default BuyPageOfferAccept;
