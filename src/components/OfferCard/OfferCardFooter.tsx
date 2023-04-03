import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { Offer } from '../../types/Offer';
import { Chain } from '../../types/Chain';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import TransactionID from '../TransactionID/TransactionID';
import useShopPage from '../../hooks/useShopPage';
import AlertBox from '../AlertBox/AlertBox';

type Props = {
  offer: Offer;
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
    <Box sx={{ padding: '16px 24px 24px', textAlign: 'center' }}>
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
      {errorMessage &&
        errorMessage.type === 'acceptOffer' &&
        errorMessage.offer &&
        errorMessage.offer === offer.offerId &&
        errorMessage.text && (
          <AlertBox wrapperStyle={{ marginTop: '12px' }} color="error">
            {errorMessage.text}
          </AlertBox>
        )}
    </Box>
  );
};

export default OfferCardFooter;
