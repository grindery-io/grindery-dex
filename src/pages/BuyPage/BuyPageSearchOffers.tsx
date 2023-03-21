import { Box } from '@mui/system';
import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useGrinderyNexus } from 'use-grindery-nexus';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexSelectChainAndTokenButton from '../../components/grindery/DexSelectChainAndTokenButton/DexSelectChainAndTokenButton';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
import useBuyPage from '../../hooks/useBuyPage';

type Props = {};

const BuyPageSearchOffers = (props: Props) => {
  const { user, connect } = useGrinderyNexus();
  const {
    VIEWS,
    errorMessage,
    toChain,
    toToken,
    toAmount,
    loading,
    fromChain,
    fromToken,
    handleToAmountChange,
    handleSearchClick,
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
          />
        </Box>
        <DexTextInput
          label="You pay"
          value={toAmount}
          onChange={handleToAmountChange}
          name="toAmount"
          disabled={false}
          error={errorMessage}
          placeholder="0"
        />
        <DexCardSubmitButton
          label={user ? 'Search offers' : 'Connect wallet'}
          onClick={
            user
              ? handleSearchClick
              : () => {
                  connect();
                }
          }
          disabled={loading}
        />
      </DexCardBody>
    </DexCard>
  );
};

export default BuyPageSearchOffers;
