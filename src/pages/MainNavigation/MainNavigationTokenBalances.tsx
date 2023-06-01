import React from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { selectUserStore, useAppSelector } from '../../store';
import { TokenType } from '../../types';

type TokenDetails = {
  token: TokenType;
  price: number;
  balance: string;
};

type Props = {};

const MainNavigationTokenBalances = (props: Props) => {
  const { userTokens } = useAppSelector(selectUserStore);

  return (
    <Stack
      direction="column"
      alignItems="stretch"
      justifyContent="flex-start"
      flexWrap="nowrap"
      gap="8px"
    >
      {userTokens.map((userToken: TokenDetails) => (
        <Stack
          key={userToken.token._id}
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          flexWrap="nowrap"
          sx={{ minHeight: '33px', padding: '0 8px' }}
        >
          <Avatar
            src={userToken.token.icon}
            sx={{ width: '24px', height: '24px', marginRight: '8px' }}
          />
          <Typography
            sx={{
              fontWeight: '400',
              fontSize: '14px',
              lineHeight: '100%',
              marginRight: '16px',
              color: '#0B0D17',
            }}
          >
            {userToken.token.symbol}
          </Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <Typography
              sx={{
                fontWeight: '400',
                fontSize: '14px',
                lineHeight: '125%',
                color: '#0B0D17',
                textAlign: 'right',
              }}
            >
              {parseFloat(
                parseFloat(userToken.balance || '0').toFixed(6)
              ).toString()}
            </Typography>
            <Typography
              sx={{
                fontWeight: '400',
                fontSize: '10px',
                lineHeight: '125%',
                color: '#808898',
                margin: '2px 0 0',
                textAlign: 'right',
              }}
            >
              {parseFloat(
                (userToken.price * parseFloat(userToken.balance)).toFixed(2)
              ).toString()}{' '}
              USD
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
};

export default MainNavigationTokenBalances;
