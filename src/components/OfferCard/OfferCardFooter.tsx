import React from 'react';
import { Box, Skeleton } from '@mui/material';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import TransactionID from '../TransactionID/TransactionID';
import Offer from '../../models/Offer';

type Props = {
  offer: Offer;
};

const OfferCardFooter = (props: Props) => {
  const { offer } = props;
  const { chains } = useGrinderyChains();

  const explorerLink = offer.getOfferLink(chains);

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
