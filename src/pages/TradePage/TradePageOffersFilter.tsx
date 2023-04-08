import React from 'react';
import { Button, IconButton, Stack, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import AlertBox from '../../components/AlertBox/AlertBox';
import AmountInput from '../../components/AmountInput/AmountInput';
import DexCard from '../../components/DexCard/DexCard';
import DexCardBody from '../../components/DexCard/DexCardBody';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import SelectChainAndTokenButton from '../../components/SelectChainAndTokenButton/SelectChainAndTokenButton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { GRT_CONTRACT_ADDRESS } from '../../config/constants';
import { ROUTES } from '../../config/routes';
import { useAppSelector } from '../../store/storeHooks';
import {
  selectUserAccessToken,
  selectUserId,
} from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';
import {
  selectTradeError,
  selectTradeFilter,
  selectTradeFromTokenBalance,
  selectTradeLoading,
} from '../../store/slices/tradeSlice';
import { getChainById } from '../../utils/helpers/chainHelpers';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { getTokenById } from '../../utils/helpers/tokenHelpers';
import { useTradeController } from '../../controllers/TradeController';

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
    <DexCard>
      <DexCardHeader
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
      <DexCardBody>
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

        <DexCardSubmitButton
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
      </DexCardBody>
    </DexCard>
  );
};

export default TradePageOffersFilter;
