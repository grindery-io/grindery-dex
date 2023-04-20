import React from 'react';
import { Avatar, Box, Chip, Skeleton, Typography } from '@mui/material';
import {
  selectChainsItems,
  selectUserAccessToken,
  selectUserChainId,
  selectUserChainTokenBalance,
  selectUserChainTokenBalanceLoading,
  useAppSelector,
} from '../../store';
import { getTokenBySymbol } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config';
import { AvatarDefault } from '../../components';

type Props = {};

const MainNavigationWalletBalance = (props: Props) => {
  let navigate = useNavigate();
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const walletBalance = useAppSelector(selectUserChainTokenBalance);
  const walletBalanceLoading = useAppSelector(
    selectUserChainTokenBalanceLoading
  );
  const chains = useAppSelector(selectChainsItems);
  const goerliNativeToken = getTokenBySymbol('ETH', '5', chains);

  const handleGetClick = () => {
    navigate(ROUTES.FAUCET.FULL_PATH);
  };

  return accessToken && userChainId === '5' ? (
    <Box
      className="MainNavigationWalletBalance"
      sx={{
        '& .MuiChip-root': {
          background: 'transparent',
          border: '1px solid #E3E3E8',
          borderRadius: '48px',
          padding: '11px 16px',
          height: 'auto',
          transition: 'border-color 0.2s ease-in-out',
          '&:hover': {
            background: 'transparent',
          },
          '&.MuiChip-clickable:hover': {
            borderColor: '#0b0d17 !important',
          },
          '& .MuiChip-label': {
            fontSize: '16px',
            lineHeight: 1.5,
            padding: 0,
          },
          '& .MuiChip-avatar': {
            margin: '0 4px 0 0',
            width: '16px',
            height: '16px',
          },
        },
      }}
    >
      {walletBalanceLoading ? (
        <Skeleton
          width="100px"
          variant="rounded"
          height="48px"
          sx={{ borderRadius: '48px' }}
        />
      ) : (
        <>
          {parseFloat(walletBalance) > 0 ? (
            <Chip
              avatar={
                goerliNativeToken?.icon ? (
                  <Avatar
                    src={goerliNativeToken?.icon}
                    alt={goerliNativeToken?.symbol}
                  />
                ) : (
                  <AvatarDefault sx={{ width: '16px', height: '16px' }} />
                )
              }
              label={parseFloat(
                parseFloat(walletBalance).toFixed(6)
              ).toString()}
            />
          ) : (
            <Chip
              avatar={
                goerliNativeToken?.icon ? (
                  <Avatar
                    src={goerliNativeToken?.icon}
                    alt={goerliNativeToken?.symbol}
                  />
                ) : (
                  <AvatarDefault sx={{ width: '16px', height: '16px' }} />
                )
              }
              label={
                <Typography
                  component="span"
                  sx={{
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    color: 'inherit',
                    fontWeight: '700',
                  }}
                >
                  0.0000 / <span style={{ color: '#EA5230' }}>Get gETH</span>
                </Typography>
              }
              onClick={handleGetClick}
            />
          )}
        </>
      )}
    </Box>
  ) : null;
};

export default MainNavigationWalletBalance;
