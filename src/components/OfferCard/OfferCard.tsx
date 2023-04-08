import React from 'react';
import { Box } from '@mui/material';
import OfferCardHeader from './OfferCardHeader';
import OfferCardBody from './OfferCardBody';
import OfferCardAction from './OfferCardAction';
import OfferCardFooter from './OfferCardFooter';
import { OfferType } from '../../types/OfferType';
import { ChainType } from '../../types/ChainType';
import { TokenType } from '../../types/TokenType';

export type OfferCardProps = {
  offer: OfferType;
  fromChain: ChainType;
  fromToken: TokenType;
  tokenPrice: number | null;
  chains: ChainType[];
  accepting: string;
  onAcceptOfferClick: (offer: OfferType) => void;
};

const OfferCard = (props: OfferCardProps) => {
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
      <OfferCardHeader {...props} />
      <OfferCardBody {...props} />

      <OfferCardAction {...props} />
      <OfferCardFooter {...props} />
    </Box>
  );
};

export default OfferCard;
