import React from 'react';
import { Alert } from '@mui/material';
import {
  useAppSelector,
  selectUserAdvancedMode,
  selectUserAdvancedModeAlert,
  useAppDispatch,
  setUserAdvancedModeAlert,
} from '../../store';

type Props = {};

const MainNavigationAdvancedModeAlert = (props: Props) => {
  const advancedMode = useAppSelector(selectUserAdvancedMode);
  const advancedModeAlert = useAppSelector(selectUserAdvancedModeAlert);
  const dispatch = useAppDispatch();

  return advancedMode && advancedModeAlert ? (
    <Alert
      onClose={() => {
        dispatch(setUserAdvancedModeAlert(false));
      }}
      sx={{
        '& .MuiAlert-icon': {
          marginLeft: 'auto',
        },
      }}
      severity="warning"
    >
      Your are in advanced mode. It is safe to use but some information and
      features might not be working yet.
    </Alert>
  ) : null;
};

export default MainNavigationAdvancedModeAlert;
