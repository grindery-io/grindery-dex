import React from 'react';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { NotistackSnackbar } from '../components';

type Props = {
  children: React.ReactNode;
};

const SnackbarsController = (props: Props) => {
  const { children } = props;

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
