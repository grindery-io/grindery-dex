import React from 'react';
import { Box } from '@mui/material';
import OfferCardHeader from './OfferCardHeader';
import OfferCardBody from './OfferCardBody';
import OfferCardAction from './OfferCardAction';
import OfferCardFooter from './OfferCardFooter';
import { ChainType, OfferType, TokenType } from '../../types';

export type OfferCardProps = {
  id: string;
  key: string;
  offer: OfferType;
  fromChain: ChainType;
  fromToken: TokenType;
  tokenPrice: number | null;
  chains: ChainType[];
  accepting: string;
  advancedMode?: boolean;
  onAcceptOfferClick: (offer: OfferType) => void;
};

const OfferCard = (props: OfferCardProps) => {
  const { offer } = props;
  return (
    <Box
      data-provider={offer.provider}
      className="OfferCard"
      sx={{
        background: '#FFFFFF',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '335px',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
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
