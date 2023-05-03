import React, { useEffect } from 'react';
import {
  SnackbarProvider,
  closeSnackbar,
  enqueueSnackbar,
  MaterialDesignContent,
} from 'notistack';
import { IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from '../store';
import { selectMessagesItems } from '../store/slices/messagesSlice';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent': {
    borderRadius: '4px',
    boxShadow: 'none',
    maxWidth: '400px',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    paddingBottom: '4px',
    '& .notistack__close': {
      marginTop: '3px',
    },
    '& #notistack-snackbar': {
      alignItems: 'flex-start',
      '& svg': {
        marginTop: '-2px',
      },
    },
  },
  '&.notistack-MuiContent-success': {
    backgroundColor: 'rgb(237, 247, 237)',
    color: 'rgb(30, 70, 32)',
    '& svg': {
      color: 'rgb(46, 125, 50)',
    },
    '& .notistack__close svg': {
      color: 'rgb(30, 70, 32)',
    },
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: 'rgb(253, 237, 237)',
    color: 'rgb(95, 33, 32)',
    '& svg': {
      color: 'rgb(211, 47, 47)',
    },
    '& .notistack__close svg': {
      color: 'rgb(95, 33, 32)',
    },
  },
  '&.notistack-MuiContent-info': {
    backgroundColor: 'rgb(229, 246, 253)',
    color: 'rgb(1, 67, 97)',
    '& svg': {
      color: 'rgb(2, 136, 209)',
    },
    '& .notistack__close svg': {
      color: 'rgb(1, 67, 97)',
    },
  },
  '&.notistack-MuiContent-warning': {
    backgroundColor: 'rgb(255, 244, 229)',
    color: 'rgb(102, 60, 0)',
    '& svg': {
      color: 'rgb(237, 108, 2)',
    },
    '& .notistack__close svg': {
      color: 'rgb(102, 60, 0)',
    },
  },
}));

type Props = {
  children: React.ReactNode;
};

const SnackbarsController = (props: Props) => {
  const { children } = props;
  const messages = useAppSelector(selectMessagesItems);

  useEffect(() => {
    const allMessages = [...messages];
    const lastMessage = allMessages.pop();
    if (lastMessage) {
      if (lastMessage.result === 'authenticated') {
        enqueueSnackbar(`Websocket authenticated!`, {
          variant: 'info',
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
          success: StyledMaterialDesignContent,
          error: StyledMaterialDesignContent,
          info: StyledMaterialDesignContent,
          warning: StyledMaterialDesignContent,
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
