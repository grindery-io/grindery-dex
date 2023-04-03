import React from 'react';
import { Box, Button } from '@mui/material';
import { Offer } from '../../types/Offer';
import useShopPage from '../../hooks/useShopPage';
import LoadingButton from '@mui/lab/LoadingButton';
import AlertBox from '../AlertBox/AlertBox';
import Loading from '../Loading/Loading';

type Props = {
  offer: Offer;
};

const OfferCardAction = (props: Props) => {
  const { offer } = props;
  const { handleAcceptOfferClick, accepting, handleModalOpened } =
    useShopPage();
  const loading = Boolean(
    accepting && offer.offerId && accepting === offer.offerId
  );

  return (
    <Box
      sx={{
        margin: '8px 16px 0',
        '& > div': {
          margin: '0',
          padding: '0',
        },
        '& button': {
          background: '#F57F21',
          margin: '0',
          fontWeight: '500',
          borderRadius: '8px',
          '&:hover': {
            background: '#e96d0a',
            opacity: 1,
          },
          '& span': {
            marginRight: '0',
          },
        },
      }}
    >
      <LoadingButton
        fullWidth
        disabled={Boolean(accepting) && !loading}
        startIcon={
          loading ? (
            <Loading
              style={{ margin: '0 10px 0 0', color: '#fff' }}
              size={16}
            />
          ) : undefined
        }
        onClick={() => {
          if (loading) {
            handleModalOpened();
          } else {
            handleAcceptOfferClick(offer);
          }
        }}
      >
        {loading ? 'Waiting transaction' : 'Buy now'}
      </LoadingButton>
    </Box>
  );
};

export default OfferCardAction;
