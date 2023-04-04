import React from 'react';
import { Box } from '@mui/material';
import OfferCardHeader from './OfferCardHeader';
import OfferCardBody from './OfferCardBody';
import OfferCardAction from './OfferCardAction';
import OfferCardFooter from './OfferCardFooter';
import Offer from '../../models/Offer';

type Props = {
  offer: Offer;
};

const OfferCard = (props: Props) => {
  const { offer } = props;

  return (
    <Box
      sx={{
        background: '#FFFFFF',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '335px',
        margin: '0',
      }}
    >
      <OfferCardHeader offer={offer} />
      <OfferCardBody offer={offer} />

      <OfferCardAction offer={offer} />
      <OfferCardFooter offer={offer} />
    </Box>
  );
};

export default OfferCard;
