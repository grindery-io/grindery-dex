import React from 'react';
import { Avatar, Box, Chip, Skeleton } from '@mui/material';
import {
  selectChainsItems,
  selectUserAccessToken,
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
  const walletBalance = useAppSelector(selectUserChainTokenBalance);
  const walletBalanceLoading = useAppSelector(
    selectUserChainTokenBalanceLoading
  );
  const chains = useAppSelector(selectChainsItems);
  const goerliNativeToken = getTokenBySymbol('ETH', '5', chains);

  const handleGetClick = () => {
    navigate(ROUTES.FAUCET.FULL_PATH);
  };

  return accessToken ? (
    <Box className="MainNavigationWalletBalance">
      {walletBalanceLoading ? (
        <Skeleton
          width="100px"
          variant="rounded"
          height="32px"
          sx={{ borderRadius: '16px' }}
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
                  <AvatarDefault sx={{ width: '24px', height: '24px' }} />
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
                  <AvatarDefault sx={{ width: '24px', height: '24px' }} />
                )
              }
              label="empty / get"
              onClick={handleGetClick}
            />
          )}
        </>
      )}
    </Box>
  ) : null;
};

export default MainNavigationWalletBalance;
