import React, { useState } from 'react';
import {
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
        Your session expired
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <HistoryToggleOffIcon sx={{ fontSize: '40px' }} />
        </Box>
        <Typography textAlign="center">
          <button
            style={{
              fontSize: 'inherit',
              padding: 0,
              display: 'inline',
              margin: 0,
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              appearance: 'none',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={(event) => {
              window.location.reload();
            }}
          >
            Reload the page
          </button>{' '}
          and reconnect your wallet if needed.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
