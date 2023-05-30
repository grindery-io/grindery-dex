import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
      <DialogContent>
        <Box sx={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src="/images/session-expired.svg"
            alt=""
            style={{
              display: 'block',
              width: '88px',
              height: '88px',
              margin: '0 auto',
            }}
          />
        </Box>
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: '700',
            paddingBottom: '24px',
            margin: 0,
          }}
        >
          Your session expired
        </Typography>
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
