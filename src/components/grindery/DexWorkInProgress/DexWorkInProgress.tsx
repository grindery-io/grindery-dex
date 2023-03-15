import React from 'react';
import { Box, Typography } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';

type Props = {
  text: React.ReactNode;
};

const DexWorkInProgress = (props: Props) => {
  const { text } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
        padding: 3,
        marginTop: '16px',
      }}
    >
      <Typography fontSize={48} lineHeight={1}>
        <EngineeringIcon fontSize="inherit" />
      </Typography>
      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mt={2}
        px={2}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default DexWorkInProgress;
