import React from 'react';
import { Alert, Switch, Tooltip } from '@mui/material';
import {
  useAppSelector,
  selectUserAdvancedMode,
  selectUserAdvancedModeAlert,
  useAppDispatch,
  selectUserId,
  setUserAdvancedModeAlert,
} from '../../store';
import { useUserProvider } from '../../providers';

type Props = {};

const MainNavigationAdvancedModeAlert = (props: Props) => {
  const userId = useAppSelector(selectUserId);
  const advancedMode = useAppSelector(selectUserAdvancedMode);
  const advancedModeAlert = useAppSelector(selectUserAdvancedModeAlert);
  const dispatch = useAppDispatch();
  const { handleAdvancedModeToggleAction } = useUserProvider();

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
      <Tooltip title="Disable advanced mode">
        <Switch
          checked={advancedMode}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleAdvancedModeToggleAction(userId, event.target.checked);
          }}
          color="success"
          sx={{
            marginRight: '0',
            marginTop: '-15px',
            marginBottom: '-15px',
            marginLeft: '8px',
            padding: '8px 10px',
            height: '28px',
            '& .MuiSwitch-switchBase': {
              '&:hover': {
                background: 'transparent !important',
              },
            },
            '& .MuiSwitch-thumb': {
              marginTop: '-5px',
            },
          }}
        />
      </Tooltip>
    </Alert>
  ) : null;
};

export default MainNavigationAdvancedModeAlert;
