import React from 'react';
import { Box, Skeleton } from '@mui/material';
import TransactionID from '../TransactionID/TransactionID';
import { getOfferLink } from '../../utils';
import { OfferCardProps } from './OfferCard';

const OfferCardFooter = (props: OfferCardProps) => {
  const { offer, chains, advancedMode } = props;
  const isInAdvancedMode = advancedMode !== undefined ? advancedMode : true;
  const explorerLink = getOfferLink(offer, chains);

  return isInAdvancedMode ? (
    <Box sx={{ padding: '16px', textAlign: 'center' }}>
      {offer.hash ? (
        <TransactionID
          containerStyle={{ justifyContent: 'center' }}
          valueStyle={{
            color: '#0B0C0E',
          }}
          iconStyle={{
            color: '#9DA2AE',
          }}
          value={offer.offerId || offer.hash || ''}
          link={explorerLink}
        />
      ) : (
        <Skeleton />
      )}
    </Box>
  ) : (
    <Box height="16px" />
  );
};

export default OfferCardFooter;
