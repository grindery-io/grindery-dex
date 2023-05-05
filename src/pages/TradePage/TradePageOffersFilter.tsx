import React, { useCallback, useEffect } from 'react';
import _ from 'lodash';
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
  selectTradeError,
  selectTradeFilter,
  selectTradeLoading,
  selectChainsItems,
  selectUserChainTokenBalance,
  selectUserChainTokenBalanceLoading,
  selectUserChainId,
} from '../../store';
import { useTradeProvider } from '../../providers';
import { getChainById, getTokenById } from '../../utils';
import { TokenType } from '../../types';

type Props = {};

const TradePageOffersFilter = (props: Props) => {
  let navigate = useNavigate();
  const errorMessage = useAppSelector(selectTradeError);
  const userChainId = useAppSelector(selectUserChainId);
  const loading = useAppSelector(selectTradeLoading);
  const chains = useAppSelector(selectChainsItems);
  const filter = useAppSelector(selectTradeFilter);
  const { toChainId, toTokenId, amount } = filter;
  const toChain = getChainById(toChainId, chains);
  const toToken = getTokenById(toTokenId, toChainId, chains);
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
  } = useTradeProvider();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    _.debounce(handleSearchOffersAction, 1000),
    [handleSearchOffersAction]
  );

  useEffect(() => {
    if (
      filter &&
      filter.amount &&
      filter.toChainId &&
      filter.toTokenId &&
      chains &&
      fromChain?.chainId &&
      fromToken?.coinmarketcapId
    ) {
      debouncedSearch(
        filter,
        chains,
        fromChain?.chainId,
        fromToken?.coinmarketcapId
      );
    }
  }, [
    filter,
    chains,
    fromChain?.chainId,
    fromToken?.coinmarketcapId,
    debouncedSearch,
  ]);

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
          label={'Search offers'}
          onClick={() => {
            handleSearchOffersAction(
              filter,
              chains,
              fromChain?.chainId || '',
              fromToken?.coinmarketcapId || ''
            );
          }}
          disabled={loading}
        />
      </PageCardBody>
    </PageCard>
  );
};

export default TradePageOffersFilter;
