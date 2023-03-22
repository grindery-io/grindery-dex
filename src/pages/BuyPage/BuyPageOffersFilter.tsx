import { Button } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useGrinderyNexus } from 'use-grindery-nexus';
import DexAlertBox from '../../components/grindery/DexAlertBox/DexAlertBox';
import DexAmountInput from '../../components/grindery/DexAmountInput/DexAmountInput';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexSelectChainAndTokenButton from '../../components/grindery/DexSelectChainAndTokenButton/DexSelectChainAndTokenButton';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
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
    handleFromAmountChange,
    handleSearchClick,
    handleFromAmountMaxClick,
  } = useBuyPage();
  let navigate = useNavigate();
  return (
    <DexCard>
      <DexCardHeader title="Buy" />
      <DexCardBody>
        <DexSelectChainAndTokenButton
          title="Deposit"
          chain={fromChain}
          token={fromToken}
          error={errorMessage}
          onClick={() => {
            navigate(VIEWS.SELECT_FROM_CHAIN.fullPath);
          }}
          name="fromChain"
        />
        <Box mt="20px">
          <DexSelectChainAndTokenButton
            title="Receive"
            onClick={() => {
              navigate(VIEWS.SELECT_TO_CHAIN_TOKEN.fullPath);
            }}
            chain={toChain}
            token={toToken}
            error={errorMessage}
            name="toChain"
          />
        </Box>
        <DexAmountInput
          label="You pay"
          value={fromAmount}
          onChange={handleFromAmountChange}
          name="fromAmount"
          disabled={false}
          error={errorMessage}
          placeholder="0"
          chain={fromChain}
          token={fromToken}
          helpText={`${parseFloat(fromAmount || '0').toLocaleString()} $`}
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
                    margin: '0',
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
            <DexAlertBox color="error">
              <p>{errorMessage.text}</p>
            </DexAlertBox>
          )}

        <DexCardSubmitButton
          label={user ? 'Search offers' : 'Connect wallet'}
          onClick={
            user
              ? handleSearchClick
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
