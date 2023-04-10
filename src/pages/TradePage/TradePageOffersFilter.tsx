import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, Stack, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
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
  selectTradeFromTokenBalance,
  selectTradeLoading,
  selectChainsItems,
} from '../../store';
import { useUserController, useTradeController } from '../../controllers';
import { getChainById, getTokenById } from '../../utils';

type Props = {};

const TradePageOffersFilter = (props: Props) => {
  let navigate = useNavigate();
  const user = useAppSelector(selectUserId);
  const accessToken = useAppSelector(selectUserAccessToken);
  const { connectUser: connect } = useUserController();
  const errorMessage = useAppSelector(selectTradeError);
  const loading = useAppSelector(selectTradeLoading);
  const fromTokenBalance = useAppSelector(selectTradeFromTokenBalance);
  const chains = useAppSelector(selectChainsItems);
  const filter = useAppSelector(selectTradeFilter);
  const { fromChainId, fromTokenId, toChainId, toTokenId, amount } = filter;
  const fromChain = getChainById(fromChainId, chains);
  const fromToken = getTokenById(fromTokenId, fromChainId, chains);
  const toChain = getChainById(toChainId, chains);
  const toToken = getTokenById(toTokenId, toChainId, chains);
  const {
    handleTradeFilterChange,
    handleFromAmountMaxClick,
    handleSearchOffersAction,
  } = useTradeController();

  return (
    <PageCard>
      <PageCardHeader
        title="Trade"
        endAdornment={
          user ? (
            <Tooltip title="Orders history">
              <IconButton
                sx={{ marginRight: '-8px' }}
                onClick={() => {
                  navigate(ROUTES.BUY.TRADE.HISTORY.FULL_PATH);
                }}
              >
                <ReceiptLongIcon />
              </IconButton>
            </Tooltip>
          ) : undefined
        }
      />
      <PageCardBody>
        <Stack
          direction="row"
          alignItems="stretch"
          justifyContent="space-between"
          gap="16px"
        >
          <Box sx={{ maxWidth: 'calc(50% - 8px)', overflow: 'hidden' }}>
            <SelectChainAndTokenButton
              title="Deposit"
              chain={fromChain}
              token={fromToken || ''}
              error={errorMessage}
              onClick={() => {
                navigate(ROUTES.BUY.TRADE.SELECT_FROM.FULL_PATH);
              }}
              name="fromChain"
            />
          </Box>
          <Box sx={{ maxWidth: 'calc(50% - 8px)' }}>
            <SelectChainAndTokenButton
              title="Receive"
              onClick={() => {
                navigate(ROUTES.BUY.TRADE.SELECT_TO.FULL_PATH);
              }}
              chain={toChain}
              token={toToken || ''}
              error={errorMessage}
              name="toChain"
            />
          </Box>
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
            GRT_CONTRACT_ADDRESS[fromChain?.value || ''] && fromTokenBalance ? (
              <Box>
                <Button
                  disableElevation
                  size="small"
                  variant="contained"
                  onClick={() => {
                    handleFromAmountMaxClick(fromTokenBalance);
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
                    fromTokenBalance
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
