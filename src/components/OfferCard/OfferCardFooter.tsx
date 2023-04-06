import React from 'react';
import { Box, Skeleton } from '@mui/material';
import TransactionID from '../TransactionID/TransactionID';
import Offer from '../../models/Offer';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { useAppSelector } from '../../store/storeHooks';

type Props = {
  offer: Offer;
};

const OfferCardFooter = (props: Props) => {
  const { offer } = props;
  const chains = useAppSelector(selectChainsItems);

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
