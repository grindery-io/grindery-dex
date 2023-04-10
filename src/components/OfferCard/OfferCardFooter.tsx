import React from 'react';
import { Box, Skeleton } from '@mui/material';
import TransactionID from '../TransactionID/TransactionID';
import { getOfferLink } from '../../utils';
import { OfferCardProps } from './OfferCard';

const OfferCardFooter = (props: OfferCardProps) => {
  const { offer, chains } = props;

  const explorerLink = getOfferLink(offer, chains);

  return (
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
          value={offer.hash}
          link={explorerLink}
        />
      ) : (
        <Skeleton />
      )}
    </Box>
  );
};

export default OfferCardFooter;
