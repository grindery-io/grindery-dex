import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import {
  SelectChainAndTokenButton,
  AmountInput,
  AlertBox,
  PageCard,
  PageCardHeader,
  PageCardBody,
  PageCardSubmitButton,
} from '../../components';
import { ROUTES, GRT_CONTRACT_ADDRESS } from '../../config';
import {
  useAppSelector,
  selectUserAccessToken,
  selectUserId,
  selectTradeError,
  selectTradeFilter,
  selectTradeLoading,
  selectChainsItems,
  selectUserChainId,
  selectUserChainTokenBalance,
  selectUserChainTokenBalanceLoading,
} from '../../store';
import { useUserController, useTradeController } from '../../controllers';
import { getChainById, getTokenById } from '../../utils';
import { TokenType } from '../../types';

type Props = {};

const TradePageOffersFilter = (props: Props) => {
  let navigate = useNavigate();
  const user = useAppSelector(selectUserId);
  const accessToken = useAppSelector(selectUserAccessToken);
  const { connectUser: connect } = useUserController();
  const errorMessage = useAppSelector(selectTradeError);
  const loading = useAppSelector(selectTradeLoading);
  const chains = useAppSelector(selectChainsItems);
  const filter = useAppSelector(selectTradeFilter);
  const { toChainId, toTokenId, amount } = filter;
  const toChain = getChainById(toChainId, chains);
  const toToken = getTokenById(toTokenId, toChainId, chains);
  const userChainId = useAppSelector(selectUserChainId);
  const fromChain = getChainById(userChainId, chains);
  const fromToken = fromChain?.tokens?.find(
    (token: TokenType) => token.symbol === fromChain?.nativeToken
  );
  const userChainTokenBalance = useAppSelector(selectUserChainTokenBalance);
  const userChainTokenBalanceLoading = useAppSelector(
    selectUserChainTokenBalanceLoading
  );

  const {
    handleTradeFilterChange,
    handleFromAmountMaxClick,
    handleSearchOffersAction,
  } = useTradeController();

  return (
    <PageCard>
      <PageCardHeader title="Trade" />
      <PageCardBody>
        <SelectChainAndTokenButton
          title="Receive"
          onClick={() => {
            navigate(ROUTES.BUY.TRADE.SELECT_TO.FULL_PATH);
          }}
          chain={toChain}
          token={toToken || ''}
          error={errorMessage}
          name="toChain"
          id="receive-button"
        />

        <AmountInput
          label="You pay"
          value={amount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleTradeFilterChange('amount', event.target.value);
          }}
          name="amount"
          disabled={false}
          error={errorMessage}
          placeholder="0"
          chain={fromChain}
          token={fromToken || ''}
          helpText={
            fromToken && fromChain
              ? `${(fromToken && fromToken.symbol) || ''} on ${
                  fromChain?.label
                }`
              : ''
          }
          endAdornment={
            GRT_CONTRACT_ADDRESS[fromChain?.value || ''] &&
            userChainTokenBalance &&
            !userChainTokenBalanceLoading ? (
              <Box>
                <Button
                  disableElevation
                  size="small"
                  variant="contained"
                  onClick={() => {
                    handleFromAmountMaxClick(userChainTokenBalance);
                  }}
                  sx={{
                    fontSize: '14px',
                    padding: '4px 8px 5px',
                    display: 'inline-block',
                    width: 'auto',
                    margin: '0 0 0 4px',
                    background: 'rgba(63, 73, 225, 0.08)',
                    color: 'rgb(63, 73, 225)',
                    borderRadius: '8px',
                    minWidth: 0,
                    '&:hover': {
                      background: 'rgba(63, 73, 225, 0.12)',
                      color: 'rgb(63, 73, 225)',
                    },
                  }}
                >
                  max
                </Button>
              </Box>
            ) : undefined
          }
        />
        {errorMessage &&
          errorMessage.type === 'search' &&
          errorMessage.text && (
            <AlertBox color="error">
              <p>{errorMessage.text}</p>
            </AlertBox>
          )}

        <PageCardSubmitButton
          label={user ? 'Search offers' : 'Connect wallet'}
          onClick={
            user
              ? () => {
                  handleSearchOffersAction(
                    accessToken,
                    filter,
                    chains,
                    userChainTokenBalance,
                    fromChain?.chainId || '',
                    fromToken?.coinmarketcapId || ''
                  );
                }
              : () => {
                  connect();
                }
          }
          disabled={Boolean(user) && loading}
        />
      </PageCardBody>
    </PageCard>
  );
};

export default TradePageOffersFilter;
