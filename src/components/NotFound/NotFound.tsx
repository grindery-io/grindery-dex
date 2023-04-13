import React from 'react';
import { Box, Typography } from '@mui/material';
import { SearchOff as SearchOffIcon } from '@mui/icons-material';

type Props = {
  text: React.ReactNode;
};

const NotFound = (props: Props) => {
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
        <SearchOffIcon fontSize="inherit" />
      </Typography>
      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mt={2}
        px={2}
        id="not-found-message"
      >
        {text}
      </Typography>
    </Box>
  );
};

export default NotFound;
