import React, { useEffect, useState } from 'react';
import {
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
        Quickly get any testnet token!
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            margin: '0 auto 24px',
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
