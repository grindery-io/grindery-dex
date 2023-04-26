import React from 'react';
import { Box } from '@mui/system';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { PageCardSubmitButton } from '../../components';
import { ICONS } from '../../config';
import { useUserController } from '../../controllers';

type Props = {
  open: boolean;
  onClose: () => void;
};

const ShopPageConnectWallet = (props: Props) => {
  const { open, onClose } = props;
  const { connectUser } = useUserController();

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
          <PageCardSubmitButton
            label="Connect wallet"
            onClick={() => {
              connectUser();
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShopPageConnectWallet;
