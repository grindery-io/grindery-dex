import React, { useState } from 'react';
import { ErrorMessageType } from '../../types';
import { Alert, Box, Button } from '@mui/material';
import TextInput from '../TextInput/TextInput';
import { validateEmail } from '../../utils';

type Props = {
  onSubmit: (email: string) => Promise<boolean>;
};

const EmailNotificationForm = (props: Props) => {
  const { onSubmit } = props;
  const [userEmail, setUserEmail] = useState('');
  const [userEmailSubmitted, setUserEmailSubmitted] = useState(false);
  const [userEmailError, setUserEmailError] = useState<ErrorMessageType>({
    type: '',
    text: '',
  });
  const [userEmailSubmitting, setUserEmailSubmitting] = useState(false);
  return !userEmailSubmitted ? (
    <Box>
      <TextInput
        label="Notify when my order was completed"
        value={userEmail}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setUserEmail(event.target.value);
        }}
        placeholder="you@domain.xzy"
        error={userEmailError}
        name="email"
        endAdornment={
          <Box>
            <Button
              disableElevation
              size="small"
              variant="contained"
              onClick={async () => {
                setUserEmailError({
                  type: '',
                  text: '',
                });
                if (!userEmail) {
                  setUserEmailError({
                    type: 'email',
                    text: 'Email is required',
                  });
                  return;
                }
                if (!validateEmail(userEmail)) {
                  setUserEmailError({
                    type: 'email',
                    text: 'Email is not valid',
                  });
                  return;
                }
                setUserEmailSubmitting(true);
                const res = await onSubmit(userEmail);
                if (res) {
                  setUserEmailSubmitted(true);
                  setUserEmailSubmitting(false);
                  setUserEmail('');
                  setUserEmailError({
                    type: '',
                    text: '',
                  });
                } else {
                  setUserEmailSubmitting(false);
                  setUserEmailError({
                    type: 'email',
                    text: 'Server error',
                  });
                }
              }}
              sx={{
                fontSize: '14px',
                padding: '4px 8px 5px',
                display: 'inline-block',
                width: 'auto',
                margin: '0 4px 0 4px',
                background: '#F57F21 !important',
                color: '#fff',
                borderRadius: '8px',
                minWidth: 0,
                whiteSpace: 'nowrap',
                '&:hover': {
                  background: '#F57F21',
                  color: '#fff',
                  opacity: 1,
                },
              }}
            >
              {userEmailSubmitting ? 'Submitting' : `Enable`}
            </Button>
          </Box>
        }
      />
    </Box>
  ) : (
    <Box sx={{ marginTop: '16px' }}>
      <Alert
        severity="success"
        sx={{
          background: 'rgb(237, 247, 237) !important',
          borderRadius: '5px !important',
          padding: '8px !important',
          '& .MuiAlert-icon': {
            padding: 0,
            marginRight: '10px',
          },
          '& .MuiAlert-message': {
            padding: 0,
            height: 'auto',
            lineHeight: 1.5,
            fontSize: '14px',
            color: 'rgb(30, 70, 32)',
          },
        }}
      >
        Gotcha! We will shoot you an email when the transaction has been
        completed. Make sure to check your spam folder.
      </Alert>
    </Box>
  );
};

export default EmailNotificationForm;
