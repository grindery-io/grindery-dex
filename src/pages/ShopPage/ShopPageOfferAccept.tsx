import React from 'react';
import { Box } from '@mui/system';
import useShopPage from '../../hooks/useShopPage';
import { OfferType } from '../../types/OfferType';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import Loading from '../../components/Loading/Loading';
import AlertBox from '../../components/AlertBox/AlertBox';
import Countdown from 'react-countdown';
import TransactionID from '../../components/TransactionID/TransactionID';

type Props = {};

const ShopPageOfferAccept = (props: Props) => {
  const {
    foundOffers,
    showModal,
    handleModalClosed,
    accepting,
    errorMessage,
    accepted,
  } = useShopPage();
  const { chains } = useGrinderyChains();
  const acceptedOffer =
    accepting && foundOffers.find((o: OfferType) => o.offerId === accepting);

  const explorerLink = accepted
    ? (
        chains.find((c) => c.value === `eip155:5`)?.transactionExplorerUrl || ''
      ).replace('{hash}', accepted)
    : '';

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
                value={accepted}
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
              '& .MuiButton-root': {
                color: 'black',
                borderColor: 'black',
                padding: '6px 12px',
                minWidth: 'none',
                fontSize: '14px',
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
