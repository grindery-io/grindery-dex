import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  onClose?: () => void;
};

const Popup = (props: Props) => {
  const { onClose } = props;
  const [showModal, setShowModal] = useState(false);

  const handleModalClosed = () => {
    setShowModal(false);
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowModal(true);
    }, 3000);
  }, []);

  return (
    <Dialog
      fullWidth
      sx={{
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',

        '& .MuiDialog-paper': {
          boxSizing: 'border-box',
          padding: '24px 16px 16px',
          maxWidth: '100%',
        },
      }}
      open={showModal}
      onClose={handleModalClosed}
    >
      <Box sx={{ position: 'absolute', top: '6px', right: '6px' }}>
        <IconButton sx={{ color: '#000' }} onClick={handleModalClosed}>
          <CloseIcon sx={{ fontSize: 36 }} />
        </IconButton>
      </Box>
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: '700',
          paddingBottom: '20px',
        }}
      >
        Quickly get a bunch of BNB for BSC-testnet using Goerli-Eth!
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            margin: '0 auto',
            width: '100%',
            maxWidth: '600px',
            borderRadius: '20px',
            boxSizing: 'border-box',
            backgroundImage:
              'url(https://www.grindery.io/hubfs/mercari-assets/promo-optimized.png)',
            paddingBottom: '47.33%',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <Box sx={{ textAlign: 'center', margin: '24px 0' }}>
          <Alert
            severity="warning"
            sx={{
              background: '#FFF1D6 !important',
              borderRadius: '5px !important',
              padding: '8px !important',
              width: 'auto !important',
              display: 'inline-flex',
              alignItems: 'center',
              '& .MuiAlert-icon': {
                padding: 0,
                marginRight: '10px',
              },
              '& .MuiAlert-message': {
                padding: 0,
                height: 'auto',
                lineHeight: 1.5,
                fontSize: '16px',
                color: '#0B0D17',
              },
            }}
          >
            To trade purchase with exactly 0.01 g-eth.
          </Alert>
        </Box>

        <Typography textAlign="center">
          Something not working? Want to see live transactions?{' '}
          <a
            href="https://discord.gg/PCMTWg3KzE"
            target="_blank"
            rel="noreferrer"
          >
            Join our Discord
          </a>
          .
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
