import React from 'react';
import { Avatar, Box, Chip, Skeleton } from '@mui/material';
import {
  selectChainsStore,
  selectUserStore,
  useAppSelector,
} from '../../store';
import { getChainById, getTokenBySymbol } from '../../utils';
import { AvatarDefault } from '../../components';

type Props = {};

const MainNavigationWalletBalance = (props: Props) => {
  const {
    accessToken,
    chainId: userChainId,
    userTokens,
  } = useAppSelector(selectUserStore);
  const { items: chains } = useAppSelector(selectChainsStore);
  const userChain = getChainById(userChainId, chains);
  const nativeToken = getTokenBySymbol(
    userChain?.nativeToken || '',
    userChainId,
    chains
  );
  const balance =
    userTokens.find(
      (userToken) => userToken.token.symbol === nativeToken?.symbol
    )?.balance || '0';

  return accessToken && nativeToken ? (
    <Box
      className="MainNavigationWalletBalance"
      sx={{
        borderRight: '1px solid #E3E3E8',
        '& .MuiChip-root': {
          background: 'transparent',
          padding: '7px 16px 7px 0',
          height: 'auto',
          transition: 'border-color 0.2s ease-in-out',
          '&:hover': {
            background: 'transparent',
          },
          '&.MuiChip-clickable:hover': {
            borderColor: '#0b0d17 !important',
          },
          '& .MuiChip-label': {
            fontSize: '14px',
            lineHeight: 1,
            color: '#0B0D17',
            padding: 0,
          },
          '& .MuiChip-avatar': {
            margin: '0 8px 0 0',
            width: '16px',
            height: '16px',
            '& img': {
              width: '100%',
              height: '100%',
            },
          },
        },
      }}
    >
      {userTokens.length < 1 ? (
        <Skeleton
          width="60px"
          variant="rounded"
          height="16px"
          sx={{ borderRadius: '6px', margin: '7px 16px 7px 0' }}
        />
      ) : (
        <Chip
          avatar={
            nativeToken.icon ? (
              <Avatar src={nativeToken.icon} alt={nativeToken.symbol} />
            ) : (
              <AvatarDefault sx={{ width: '16px', height: '16px' }} />
            )
          }
          label={parseFloat(parseFloat(balance).toFixed(6)).toString()}
        />
      )}
    </Box>
  ) : null;
};

export default MainNavigationWalletBalance;
