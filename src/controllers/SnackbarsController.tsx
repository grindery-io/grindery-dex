import React, { useEffect } from 'react';
import { SnackbarProvider, closeSnackbar, enqueueSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../store';
import {
  selectMessagesItems,
  setMessagesItem,
} from '../store/slices/messagesSlice';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { getNotificationObject } from '../utils';
import { NotistackSnackbar } from '../components';

type Props = {
  children: React.ReactNode;
};

const SnackbarsController = (props: Props) => {
  const { children } = props;
  const messages = useAppSelector(selectMessagesItems);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const allMessages = [...messages];
    const lastMessage = allMessages.pop();
    if (lastMessage) {
      const notification = getNotificationObject(lastMessage);
      if (notification) {
        enqueueSnackbar(notification.text, {
          variant: 'info',
          ...notification.props,
        });
      }
    }
  }, [messages]);

  return (
    <>
      <SnackbarProvider
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        action={(snackbarId) => (
          <IconButton
            className="notistack__close"
            size="small"
            onClick={() => closeSnackbar(snackbarId)}
            color="inherit"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
        Components={{
          success: NotistackSnackbar,
          error: NotistackSnackbar,
          info: NotistackSnackbar,
          warning: NotistackSnackbar,
        }}
        iconVariant={{
          success: <TaskAltOutlinedIcon sx={{ marginRight: '8px' }} />,
          error: <ErrorOutlineOutlinedIcon sx={{ marginRight: '8px' }} />,
          warning: <WarningAmberOutlinedIcon sx={{ marginRight: '8px' }} />,
          info: <InfoOutlinedIcon sx={{ marginRight: '8px' }} />,
        }}
      />
      {children}
    </>
  );
};

export default SnackbarsController;
