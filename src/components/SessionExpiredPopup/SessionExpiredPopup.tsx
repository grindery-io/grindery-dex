import React, { useState } from 'react';
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
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';

type Props = {};

export const SessionExpiredPopup = (props: Props) => {
  const [showModal, setShowModal] = useState(true);

  const handleModalClosed = () => {
    setShowModal(false);
  };

  return (
    <Dialog
      fullWidth
      sx={{
        width: '100%',
        maxWidth: '550px',
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
        Your auth session has expired
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <HistoryToggleOffIcon sx={{ fontSize: '40px' }} />
        </Box>
        <Typography textAlign="center">
          Please,{' '}
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              window.location.reload();
            }}
          >
            reload the page
          </a>{' '}
          and connect your wallet again.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
