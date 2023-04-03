import React from 'react';
import { Box } from '@mui/material';
import { Offer } from '../../types/Offer';
import { Chain } from '../../types/Chain';
import { TokenType } from '../../types/TokenType';
import OfferCardHeader from './OfferCardHeader';
import OfferCardBody from './OfferCardBody';
import OfferCardAction from './OfferCardAction';
import OfferCardFooter from './OfferCardFooter';

type Props = {
  offer: Offer;
  offerChain?: Chain;
  offerToken?: TokenType;
};

const OfferCard = (props: Props) => {
  const { offer, offerChain, offerToken } = props;

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
      <OfferCardBody
        offer={offer}
        offerToken={offerToken}
        offerChain={offerChain}
      />

      <OfferCardAction offer={offer} />
      <OfferCardFooter offer={offer} />
    </Box>
  );
};

export default OfferCard;
