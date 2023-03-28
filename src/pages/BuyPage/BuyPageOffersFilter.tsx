import { Button, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useGrinderyNexus } from 'use-grindery-nexus';
import AlertBox from '../../components/AlertBox/AlertBox';
import AmountInput from '../../components/AmountInput/AmountInput';
import DexCard from '../../components/DexCard/DexCard';
import DexCardBody from '../../components/DexCard/DexCardBody';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import SelectChainAndTokenButton from '../../components/SelectChainAndTokenButton/SelectChainAndTokenButton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { GRT_CONTRACT_ADDRESS } from '../../constants';
import useBuyPage from '../../hooks/useBuyPage';

type Props = {};

const BuyPageOffersFilter = (props: Props) => {
  const { user, connect } = useGrinderyNexus();
  const {
    VIEWS,
    errorMessage,
    toChain,
    toToken,
    fromAmount,
    loading,
    fromChain,
    fromToken,
    fromTokenPrice,
    handleFromAmountChange,
    handleSearchClick,
    handleFromAmountMaxClick,
  } = useBuyPage();
  let navigate = useNavigate();
  return (
    <DexCard>
      <DexCardHeader
        title="Buy"
        endAdornment={
          user ? (
            <Tooltip title="Orders history">
              <IconButton
                sx={{ marginRight: '-8px' }}
                onClick={() => {
                  navigate(VIEWS.HISTORY.fullPath);
                }}
              >
                <ReceiptLongIcon />
              </IconButton>
            </Tooltip>
          ) : undefined
        }
      />
      <DexCardBody>
        <SelectChainAndTokenButton
          title="Deposit"
          chain={fromChain}
          token={fromToken}
          error={errorMessage}
          onClick={() => {
            navigate(VIEWS.SELECT_FROM.fullPath);
          }}
          name="fromChain"
        />
        <Box mt="20px">
          <SelectChainAndTokenButton
            title="Receive"
            onClick={() => {
              navigate(VIEWS.SELECT_TO.fullPath);
            }}
            chain={toChain}
            token={toToken}
            error={errorMessage}
            name="toChain"
          />
        </Box>
        <AmountInput
          label="You pay"
          value={fromAmount}
          onChange={handleFromAmountChange}
          name="fromAmount"
          disabled={false}
          error={errorMessage}
          placeholder="0"
          chain={fromChain}
          token={fromToken}
          helpText={
            fromToken && fromChain
              ? `${(fromToken && fromToken.symbol) || ''} on ${
                  fromChain?.label
                }`
              : ''
          }
          endAdornment={
            GRT_CONTRACT_ADDRESS[fromChain?.value || ''] ? (
              <Box>
                <Button
                  disableElevation
                  size="small"
                  variant="contained"
                  onClick={handleFromAmountMaxClick}
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
                  handleSearchClick(fromAmount);
                }
              : () => {
                  connect();
                }
          }
          disabled={
            Boolean(user) &&
            (loading ||
              Boolean(
                errorMessage &&
                  errorMessage.type === 'search' &&
                  errorMessage.text
              ))
          }
        />
      </DexCardBody>
    </DexCard>
  );
};

export default BuyPageOffersFilter;
