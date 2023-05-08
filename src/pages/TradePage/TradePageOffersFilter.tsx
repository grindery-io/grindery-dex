import React, { useCallback, useEffect } from 'react';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
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
  selectChainsStore,
  selectTradeStore,
  selectUserStore,
} from '../../store';
import { useTradeProvider } from '../../providers';
import { getChainById, getTokenById } from '../../utils';

type Props = {};

const TradePageOffersFilter = (props: Props) => {
  let navigate = useNavigate();
  const {
    error: errorMessage,
    loading,
    filter,
  } = useAppSelector(selectTradeStore);
  const {
    chainTokenBalance: userChainTokenBalance,
    chainTokenBalanceLoading: userChainTokenBalanceLoading,
  } = useAppSelector(selectUserStore);
  const { items: chains } = useAppSelector(selectChainsStore);
  const { toChainId, toTokenId, amount, fromChainId, fromTokenId } = filter;
  const toChain = getChainById(toChainId, chains);
  const toToken = getTokenById(toTokenId, toChainId, chains);
  const fromChain = getChainById(fromChainId, chains);
  const fromToken = getTokenById(fromTokenId, fromChainId, chains);

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
        <Stack direction="column" gap="20px">
          <SelectChainAndTokenButton
            title="Pay"
            onClick={() => {
              navigate(ROUTES.BUY.TRADE.SELECT_FROM.FULL_PATH);
            }}
            chain={fromChain}
            token={fromToken || ''}
            error={errorMessage}
            name="fromChain"
            id="pay-button"
          />
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
        </Stack>

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
