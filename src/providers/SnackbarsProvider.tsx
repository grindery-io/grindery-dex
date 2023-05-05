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
import { getOfferById } from '../services';
import {
  selectUserAccessToken,
  updateOfferItem,
  useAppDispatch,
  useAppSelector,
} from '../store';
import { getNotificationObject } from '../utils';
import { useNavigate } from 'react-router';
import { ROUTES } from '../config';
import { selectMessagesItems } from '../store/slices/messagesSlice';

type Props = {
  children: React.ReactNode;
};

const SnackbarsProvider = (props: Props) => {
  const { children } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectUserAccessToken);
  const messages = useAppSelector(selectMessagesItems);

  const refreshOffer = useCallback(
    async (event: JSONRPCRequestType) => {
      if (accessToken && event?.params?.type === 'offer' && event?.params?.id) {
        const offer = await getOfferById(accessToken, event.params.id);
        if (offer) {
          dispatch(updateOfferItem(offer));
          const notification = getNotificationObject(event);
          if (notification) {
            enqueueSnackbar(notification.text, {
              ...notification.props,
              persist: true,
              action: (snackbarId) => (
                <>
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => {
                      navigate(ROUTES.SELL.OFFERS.ROOT.FULL_PATH);
                      closeSnackbar(snackbarId);
                    }}
                  >
                    View
                  </Button>
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
        }
      }
    },
    [accessToken, dispatch, navigate]
  );

  useEffect(() => {
    const allMessages = [...messages];
    const lastMessage = allMessages.pop();

    refreshOffer(lastMessage);
  }, [messages, refreshOffer]);

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
