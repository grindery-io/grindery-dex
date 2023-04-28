import React, { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

type Props = {
  message: string;
};

const ErrorSnackbar = (props: Props) => {
  const { message } = props;
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (message) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    setKey((_key) => _key + 1);
  }, [message]);

  return (
    <Snackbar
      key={key}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ top: '75px !important', maxWidth: '300px' }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
