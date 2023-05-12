import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';

type Props = {
  userId: string;
  isSubscribed: boolean;
  isCanceled: boolean;
  isSupported: boolean;
  onDismiss: () => void;
  onAccept: () => void;
};

const NotificationsPopup = (props: Props) => {
  const { userId, isSubscribed, isCanceled, isSupported, onDismiss, onAccept } =
    props;
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    setIsShowing(Boolean(userId && !isSubscribed && !isCanceled));
  }, [userId, isSubscribed, isCanceled]);
  return isSupported && isShowing ? (
    <Box
      sx={{
        position: 'fixed',
        top: '0',
        left: '50%',
        minWidth: '300px',
        maxWidth: '100%',
        transform: 'translateX(-50%)',
        padding: '24px 24px 14px',
        zIndex: '9999',
        background: '#ffffff',
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
        boxShadow: '0px 10px 40px rgb(0 0 0 / 15%)',
        borderLeft: '1px solid #dcdcdc',
        borderRight: '1px solid #dcdcdc',
        borderBottom: '1px solid #dcdcdc',
      }}
    >
      <Typography
        sx={{
          fontWeight: '700',
          fontSize: '18px',
          lineHeight: '150%',
          color: '#0b0d17',
          margin: '0 0 10px',
          padding: '0px',
        }}
      >
        Get Alerts from Mercari!
      </Typography>
      <Typography
        sx={{
          fontWeight: '400',
          fontSize: '16px',
          lineHeight: '150%',
          color: '#0b0d17',
          margin: '0 0 10px',
          padding: '0px',
          maxWidth: '400px',
        }}
      >
        Mercari can send you alerts when your orders has been created or
        completed.
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        gap="15px"
        sx={{
          marginBottom: '10px',
          '& .MuiButton-root': {
            fontSize: '14px',
            padding: '8px 24px',
            margin: 0,
            '&:hover': {
              opacity: '0.9 !important',
            },
          },
          '& .MuiButton-outlined': {
            borderColor: '#3f49e1 !important',
            color: '#3f49e1 !important',
          },
          '& .MuiButton-text': {
            backgroundColor: '#3f49e1 !important',
            color: '#fff !important',
          },
        }}
      >
        <Button
          onClick={() => {
            onDismiss();
            setIsShowing(false);
          }}
          variant="outlined"
        >
          No Thanks
        </Button>

        <Button
          onClick={() => {
            onAccept();
            setIsShowing(false);
          }}
          color="primary"
        >
          Allow
        </Button>
      </Stack>
    </Box>
  ) : null;
};

export default NotificationsPopup;
