import React from 'react';
import { Box } from '@mui/system';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Loading from '../../components/Loading/Loading';
import AlertBox from '../../components/AlertBox/AlertBox';
import Countdown from 'react-countdown';
import TransactionID from '../../components/TransactionID/TransactionID';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { OfferType } from '../../types/OfferType';
import {
  selectShopAcceptedOffer,
  selectShopAcceptedOfferTx,
  selectShopAccepting,
  selectShopError,
  selectShopFilter,
  selectShopModal,
  selectShopOffers,
  setShopAcceptedOffer,
  setShopAcceptedOfferTx,
  setShopModal,
} from '../../store/slices/shopSlice';

type Props = {};

const ShopPageOfferAccept = (props: Props) => {
  const dispatch = useAppDispatch();
  const foundOffers = useAppSelector(selectShopOffers);
  const showModal = useAppSelector(selectShopModal);
  const accepting = useAppSelector(selectShopAccepting);
  const errorMessage = useAppSelector(selectShopError);
  const accepted = useAppSelector(selectShopAcceptedOffer);
  const acceptedOfferTx = useAppSelector(selectShopAcceptedOfferTx);
  const chains = useAppSelector(selectChainsItems);
  const filter = useAppSelector(selectShopFilter);
  const { fromChainId } = filter;
  const acceptedOffer =
    accepting && foundOffers.find((o: OfferType) => o.offerId === accepting);
  const explorerLink = acceptedOfferTx
    ? (
        chains.find((c) => c.value === `eip155:${fromChainId}`)
          ?.transactionExplorerUrl || ''
      ).replace('{hash}', acceptedOfferTx)
    : '';

  const handleModalClosed = () => {
    dispatch(setShopAcceptedOffer(''));
    dispatch(setShopAcceptedOfferTx(''));
    dispatch(setShopModal(false));
  };

  const countdownRenderer = ({
    total,
    completed,
  }: {
    total: any;
    completed: any;
  }) => {
    if (completed) {
      // Render a completed state
      return <span>0</span>;
    } else {
      // Render a countdown
      return <span>{total / 1000}</span>;
    }
  };

  return (
    <Dialog
      fullWidth
      sx={{ maxWidth: '375px' }}
      open={showModal}
      onClose={handleModalClosed}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        {accepting
          ? 'Waiting transaction'
          : errorMessage &&
            errorMessage.type === 'acceptOffer' &&
            errorMessage.text
          ? 'Error'
          : accepted
          ? 'Success'
          : 'Transaction result'}
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: '0' }}>
        {accepting && (
          <Box sx={{ paddingBottom: '16px' }}>
            <Loading />
          </Box>
        )}
        {errorMessage &&
          errorMessage.type === 'acceptOffer' &&
          errorMessage.text && (
            <AlertBox color="error" wrapperStyle={{ marginTop: '0' }}>
              <p>{errorMessage.text}</p>
            </AlertBox>
          )}
        {accepted && (
          <Box
            sx={{
              '& .MuiPaper-root': {
                background: 'rgb(237, 247, 237)',
              },
            }}
          >
            <AlertBox color="success" wrapperStyle={{ marginTop: '0' }}>
              <p>
                {acceptedOffer && acceptedOffer.estimatedTime ? (
                  <>
                    Your order has been placed and is expected to complete
                    within{' '}
                    <Countdown
                      date={
                        Date.now() +
                        (acceptedOffer.estimatedTime
                          ? parseInt(acceptedOffer.estimatedTime) * 1000
                          : 0)
                      }
                      renderer={countdownRenderer}
                    />
                    {} seconds. Hang tight.
                  </>
                ) : (
                  <>
                    Your order has been placed and is expected to complete soon.
                    Hang tight.
                  </>
                )}
              </p>
              <TransactionID
                containerStyle={{ marginTop: '8px' }}
                value={acceptedOfferTx}
                label="ID"
                link={explorerLink}
                startLength={6}
                endLength={6}
              />
            </AlertBox>
          </Box>
        )}
      </DialogContent>

      {!accepting && (
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Box
            sx={{
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
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ShopPageOfferAccept;
