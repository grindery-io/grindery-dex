import React, { useCallback, useEffect } from 'react';
import { SnackbarProvider, closeSnackbar, enqueueSnackbar } from 'notistack';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { NotistackSnackbar } from '../components';
import { JSONRPCRequestType } from '../types';
import { getOfferById, getOrderByIdRequest } from '../services';
import {
  selectMessagesItems,
  selectUserAccessToken,
  updateOfferItem,
  updateOrderHistoryItem,
  useAppDispatch,
  useAppSelector,
} from '../store';
import { getNotificationObject } from '../utils';
import { ROUTES } from '../config';
import { router } from '..';

type Props = {
  children: React.ReactNode;
};

const SnackbarsProvider = (props: Props) => {
  const { children } = props;
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectUserAccessToken);
  const messages = useAppSelector(selectMessagesItems);

  const showNotification = useCallback((event: JSONRPCRequestType) => {
    const notification = getNotificationObject(event);
    if (notification) {
      let route = '';
      switch (event?.params?.type) {
        case 'offer':
          route = ROUTES.SELL.OFFERS.ROOT.FULL_PATH;
          break;
        case 'order':
          route = ROUTES.HISTORY.ROOT.FULL_PATH;
          break;
      }
      enqueueSnackbar(notification.text, {
        ...notification.props,
        persist: true,
        action: (snackbarId) => (
          <>
            {route && (
              <Button
                size="small"
                color="inherit"
                onClick={() => {
                  router.navigate(route);
                  closeSnackbar(snackbarId);
                }}
              >
                View
              </Button>
            )}
            <IconButton
              className="notistack__close"
              size="small"
              onClick={() => closeSnackbar(snackbarId)}
              color="inherit"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        ),
      });
    }
  }, []);

  const updateStateAndShowNotification = useCallback(
    async (event: JSONRPCRequestType) => {
      if (accessToken && event?.params?.id) {
        if (event?.params?.type === 'offer') {
          const offer = await getOfferById(accessToken, event.params.id);
          if (offer) {
            dispatch(updateOfferItem(offer));
            showNotification(event);
          }
        }
        if (event?.params?.type === 'order') {
          const order = await getOrderByIdRequest(accessToken, event.params.id);
          if (order) {
            dispatch(updateOrderHistoryItem(order));
            showNotification(event);
          }
        }
      }
    },
    [accessToken, dispatch, showNotification]
  );

  useEffect(() => {
    const allMessages = [...messages];
    const lastMessage = allMessages.pop();
    updateStateAndShowNotification(lastMessage);
  }, [messages, updateStateAndShowNotification]);

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

export default SnackbarsProvider;
