import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { OfferType } from '../../types/OfferType';
import { Chain } from '../../types/Chain';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import TransactionID from '../TransactionID/TransactionID';
import useShopPage from '../../hooks/useShopPage';
import AlertBox from '../AlertBox/AlertBox';

type Props = {
  offer: OfferType;
};

const OfferCardFooter = (props: Props) => {
  const { offer } = props;
  const { chains } = useGrinderyChains();
  const { errorMessage } = useShopPage();

  const explorerLink = offer.hash
    ? (
        chains.find((c: Chain) => c.value === `eip155:5`)
          ?.transactionExplorerUrl || ''
      ).replace('{hash}', offer.hash || '')
    : '';

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
