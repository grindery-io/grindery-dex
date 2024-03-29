import React from 'react';
import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Loading from '../Loading/Loading';
import { OfferCardProps } from './OfferCard';

const OfferCardAction = (props: OfferCardProps) => {
  const { offer, accepting, onAcceptOfferClick } = props;
  const loading = Boolean(
    accepting && offer.offerId && accepting === offer.offerId
  );

  return (
    <Box
      className="OfferCardAction"
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
        id={props.id}
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
          onAcceptOfferClick(offer);
        }}
      >
        {loading ? 'Waiting transaction' : 'Place order'}
      </LoadingButton>
    </Box>
  );
};

export default OfferCardAction;
