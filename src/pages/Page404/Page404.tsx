import React from 'react';
import {
  PageCard,
  PageCardBody,
  PageCardHeader,
  PageContainer,
} from '../../components';
import { Box, Typography } from '@mui/material';
import { ROUTES } from '../../config';
import { mdiRobotDeadOutline } from '@mdi/js';
import Icon from '@mdi/react';

type Props = {};

const Page404 = (props: Props) => {
  return (
    <PageCard>
      <PageCardHeader title="404" titleAlign="center" />
      <PageCardBody>
        <Box sx={{ textAlign: 'center' }}>
          <Icon
            path={mdiRobotDeadOutline}
            style={{ width: '40px', height: '40px', marginBottom: '16px' }}
          />
          <Typography>
            Page not found.
            <br />
            <a style={{ color: '#3f49e1' }} href={ROUTES.BUY.TRADE.FULL_PATH}>
              Go to home page
            </a>
            .
          </Typography>
        </Box>
        <Box height="36px"></Box>
      </PageCardBody>
    </PageCard>
  );
};

export default Page404;
