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

type Props = {};

const Popup = (props: Props) => {
  const [showModal, setShowModal] = useState(false);

  const handleModalClosed = () => {
    setShowModal(false);
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

        '& .MuiPaper-root': {
          boxSizing: 'border-box',
          padding: '30px 40px',
          maxWidth: '100%',
        },
      }}
      open={showModal}
      onClose={handleModalClosed}
    >
      <Box sx={{ position: 'absolute', top: '10px', right: '10px' }}>
        <IconButton sx={{ color: '#000' }} onClick={handleModalClosed}>
          <CloseIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Quickly get a bunch of BNB for BSC-testnet using Goerli-Eth!
      </DialogTitle>
      <DialogContent>
        <img
          style={{
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
            marginBottom: '20px',
          }}
          src="https://www.grindery.io/hubfs/mercari-assets/promo-optimized.png"
          alt="A man tries to get BSC testnet tokens"
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
