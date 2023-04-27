import React from 'react';
import { Box } from '@mui/system';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { PageCardSubmitButton } from '..';
import { ICONS } from '../../config';

type Props = {
  open: boolean;
  onClose: () => void;
  onConnect: () => void;
};

const ConnectWalletModal = (props: Props) => {
  const { open, onClose, onConnect } = props;

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
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{ textAlign: 'center', paddingBottom: '0px' }}>
        Connect MetaMask wallet
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: '0' }}>
        <Box sx={{ padding: '16px 0', textAlign: 'center' }}>
          <img
            style={{ width: '100%', height: 'auto', maxWidth: '64px' }}
            src={ICONS.METAMASK}
            alt=""
          />
        </Box>
        <Box sx={{ paddingLeft: '16px', paddingRight: '16px' }}>
          <PageCardSubmitButton label="Connect wallet" onClick={onConnect} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletModal;
