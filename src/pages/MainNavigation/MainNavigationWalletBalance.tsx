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
import { getChainById, getTokenBySymbol } from '../../utils';
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
  const userChain = getChainById(userChainId, chains);
  const nativeToken = getTokenBySymbol(
    userChain?.nativeToken || '',
    userChainId,
    chains
  );

  const handleGetClick = () => {
    navigate(ROUTES.FAUCET.FULL_PATH);
  };

  return accessToken && nativeToken ? (
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
            margin: '0 6px 0 0',
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
                nativeToken.icon ? (
                  <Avatar src={nativeToken.icon} alt={nativeToken.symbol} />
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
                nativeToken.icon ? (
                  <Avatar src={nativeToken.icon} alt={nativeToken.symbol} />
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
                  0.0000
                  {
                    <>
                      {userChain?.isTestnet ? (
                        <>
                          {' '}
                          /{' '}
                          <span style={{ color: '#EA5230' }}>
                            Get {nativeToken.symbol}
                          </span>
                        </>
                      ) : null}
                    </>
                  }
                </Typography>
              }
              onClick={userChain?.isTestnet ? handleGetClick : undefined}
            />
          )}
        </>
      )}
    </Box>
  ) : null;
};

export default MainNavigationWalletBalance;
