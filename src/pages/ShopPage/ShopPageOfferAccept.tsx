import React from 'react';
import { Box } from '@mui/system';
import Countdown from 'react-countdown';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { AlertBox, Loading, OrderCard, TransactionID } from '../../components';
import {
  useAppDispatch,
  useAppSelector,
  selectChainsItems,
  selectShopAcceptedOffer,
  selectShopAcceptedOfferTx,
  selectShopAccepting,
  selectShopError,
  selectShopModal,
  setShopAcceptedOffer,
  setShopAcceptedOfferTx,
  setShopModal,
  selectOrdersItems,
} from '../../store';
import { OrderType } from '../../types';
import {
  getChainById,
  getOfferProviderLink,
  getOrderBuyerLink,
} from '../../utils';

type Props = {};

const ShopPageOfferAccept = (props: Props) => {
  const dispatch = useAppDispatch();
  const showModal = useAppSelector(selectShopModal);
  const accepting = useAppSelector(selectShopAccepting);
  const errorMessage = useAppSelector(selectShopError);
  const accepted = useAppSelector(selectShopAcceptedOffer);
  const acceptedOfferTx = useAppSelector(selectShopAcceptedOfferTx);
  const chains = useAppSelector(selectChainsItems);
  const orders = useAppSelector(selectOrdersItems);
  const createdOrder =
    acceptedOfferTx &&
    orders.find((order: OrderType) => order.hash === acceptedOfferTx);

  const providerLink =
    createdOrder && createdOrder?.offer
      ? getOfferProviderLink(createdOrder?.offer, chains)
      : undefined;

  const destAddrLink = createdOrder
    ? getOrderBuyerLink(createdOrder, chains)
    : undefined;

  const handleModalClosed = () => {
    dispatch(setShopAcceptedOffer(''));
    dispatch(setShopAcceptedOfferTx(''));
    dispatch(setShopModal(false));
  };

  const renderAddress = (value: string, link: string) => {
    return (
      <TransactionID
        value={value}
        label=""
        link={link}
        containerComponent="span"
        containerStyle={{
          display: 'inline-flex',
          gap: '2px',
        }}
        valueStyle={{
          color: '#000',
          fontSize: '14px',
          fontWeight: '500',
        }}
        startLength={6}
        endLength={4}
        buttonStyle={{
          padding: '0 1px',
        }}
      />
    );
  };

  const countdownRenderer = ({
    total,
    completed,
  }: {
    total: any;
    completed: any;
  }) => {
    if (!createdOrder) {
      return null;
    }
    if (completed) {
      // Render a completed state
      return (
        <>
          <Typography gutterBottom variant="body2">
            You should have received a transfer of {createdOrder.offer?.amount}{' '}
            {createdOrder.offer?.token} on{' '}
            {getChainById(createdOrder.offer?.chainId || '', chains)?.label ||
              ''}{' '}
            from{' '}
            {renderAddress(
              createdOrder.offer?.provider || '',
              providerLink || ''
            )}{' '}
            in your wallet{' '}
            {renderAddress(createdOrder.destAddr || '', destAddrLink || '')}.
            Check your wallet.
          </Typography>
          <Typography variant="body2">
            If you have not received anything within the next 5 minutes, please{' '}
            <a
              style={{ color: '#3f49e1' }}
              href="https://discord.gg/PCMTWg3KzE"
              target="_blank"
              rel="noreferrer"
            >
              visit our Discord
            </a>
            .
          </Typography>
        </>
      );
    } else {
      // Render a countdown
      return (
        <>
          <Typography variant="body2">
            You should receive {createdOrder.offer?.amount}{' '}
            {createdOrder.offer?.token} on{' '}
            {getChainById(createdOrder.offer?.chainId || '', chains)?.label ||
              ''}{' '}
            from{' '}
            {renderAddress(
              createdOrder.offer?.provider || '',
              providerLink || ''
            )}{' '}
            in your wallet{' '}
            {renderAddress(createdOrder.destAddr || '', destAddrLink || '')}{' '}
            within <span>{total / 1000}</span> seconds.
          </Typography>
        </>
      );
    }
  };

  return (
    <Dialog
      fullWidth
      sx={{
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
        '& .MuiDialog-paper': {
          background: '#fff',
        },
        '& .MuiDialogContent-root': {
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      }}
      open={showModal}
      onClose={handleModalClosed}
    >
      <DialogTitle sx={{ textAlign: 'center', paddingBottom: '0px' }}>
        {accepting
          ? 'Waiting for order transaction'
          : errorMessage &&
            errorMessage.type === 'acceptOffer' &&
            errorMessage.text
          ? 'Error'
          : accepted
          ? 'Your order has been placed!'
          : 'Transaction result'}
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: '0' }}>
        {accepting && (
          <Box sx={{ padding: '16px 0' }}>
            <Loading />
          </Box>
        )}

        {errorMessage &&
          errorMessage.type === 'acceptOffer' &&
          errorMessage.text && (
            <Box sx={{ paddingLeft: '16px', paddingRight: '16px' }}>
              <AlertBox color="error" wrapperStyle={{ marginTop: '0' }}>
                <p>{errorMessage.text}</p>
              </AlertBox>
            </Box>
          )}
        {accepted && (
          <>
            {createdOrder && (
              <>
                <OrderCard
                  order={createdOrder}
                  userType="a"
                  chains={chains}
                  excludeSteps={['gas', 'rate', 'time', 'impact']}
                  hideStatus
                  containerStyle={{
                    border: 'none',
                  }}
                />
                <Box sx={{ paddingLeft: '16px', paddingRight: '16px' }}>
                  <Typography variant="h6" gutterBottom>
                    What's next?
                  </Typography>
                  <Countdown
                    date={
                      Date.now() +
                      (createdOrder.offer?.estimatedTime
                        ? parseInt(createdOrder.offer.estimatedTime) * 1000
                        : 0)
                    }
                    renderer={countdownRenderer}
                  />
                </Box>
              </>
            )}
          </>
        )}
        {!accepting && (
          <Box
            sx={{
              margin: '16px 0',
              paddingLeft: '16px',
              paddingRight: '16px',
              flex: 1,
              '& .MuiButton-root': {
                color: 'black',
                borderColor: 'black',
                padding: '6px 12px',
                fontSize: '14px',
                width: '100%',
                '&:hover': {
                  borderColor: 'black',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
                '& .MuiTouchRipple-root': {
                  marginRight: '0',
                },
              },
            }}
          >
            <Button
              fullWidth
              size="small"
              variant="outlined"
              onClick={() => {
                handleModalClosed();
              }}
            >
              Close
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShopPageOfferAccept;
