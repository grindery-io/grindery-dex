import React from 'react';
import { IconButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import SelectChainAndTokenButton from '../../components/SelectChainAndTokenButton/SelectChainAndTokenButton';
import TextInput from '../../components/TextInput/TextInput';
import Loading from '../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import AlertBox from '../../components/AlertBox/AlertBox';
import useOffersPage from '../../hooks/useOffersPage';
import { CardTitle } from '../../components/Card/CardTitle';
import { chain } from 'lodash';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { Chain } from '../../types/Chain';

function OffersPageCreate() {
  const { user, connect } = useGrinderyNexus();
  const {
    amountMin,
    amountMax,
    loading,
    errorMessage,
    token,
    currentChain,
    exchangeRate,
    estimatedTime,
    setEstimatedTime,
    setAmountMin,
    setAmountMax,
    setErrorMessage,
    handleCreateClick,
    setExchangeRate,
    VIEWS,
    chain,
  } = useOffersPage();
  let navigate = useNavigate();

  const { chains } = useGrinderyChains();

  const chainLabel = chains.find((c: Chain) => c.value === chain)?.label;

  return (
    <>
      <DexCardHeader
        title="Create offer"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              setAmountMin('');
              setAmountMax('');
              setExchangeRate('');
              setEstimatedTime('');
              navigate(VIEWS.ROOT.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />

      <DexCardBody>
        <SelectChainAndTokenButton
          onClick={() => {
            navigate(VIEWS.SELECT_CHAIN.fullPath);
          }}
          title="Blockchain and token"
          chain={currentChain}
          token={token}
          error={errorMessage}
        />

        {token && (
          <>
            <CardTitle
              sx={{
                paddingTop: '20px',
                paddingLeft: '4px',
                paddingRight: 0,
                marginBottom: '6px',
              }}
            >
              {token.symbol} order amounts:
            </CardTitle>

            <Box display="flex" flexDirection="row" gap="16px">
              <TextInput
                label="Min. order"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setErrorMessage({
                    type: '',
                    text: '',
                  });
                  setAmountMin(event.target.value);
                }}
                name="amountMin"
                placeholder="0"
                disabled={false}
                value={amountMin}
                error={errorMessage}
                sx={{ marginTop: 0 }}
              />
              <TextInput
                label="Max. order"
                value={amountMax}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setErrorMessage({
                    type: '',
                    text: '',
                  });
                  setAmountMax(event.target.value);
                }}
                name="amountMax"
                placeholder="0"
                disabled={false}
                error={errorMessage}
                sx={{ marginTop: 0 }}
              />
            </Box>
            <CardTitle
              sx={{
                paddingTop: '20px',
                paddingLeft: '4px',
                paddingRight: 0,
                marginBottom: '6px',
              }}
            >
              Exchange rate:
            </CardTitle>
            <TextInput
              label={`1 ${token.symbol} on ${chainLabel} is traded for`}
              value={exchangeRate}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setErrorMessage({
                  type: '',
                  text: '',
                });
                setExchangeRate(event.target.value);
              }}
              name="exchangeRate"
              placeholder="0"
              disabled={false}
              error={errorMessage}
              sx={{ marginTop: 0 }}
              helpText="ETH on Goerli Testnet"
            />
            <TextInput
              label={`Average execution time`}
              value={estimatedTime}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setErrorMessage({
                  type: '',
                  text: '',
                });
                setEstimatedTime(event.target.value);
              }}
              name="estimatedTime"
              placeholder="0"
              disabled={false}
              error={errorMessage}
              helpText="seconds"
            />
          </>
        )}
        {errorMessage &&
          errorMessage.type === 'saveOffer' &&
          errorMessage.text && (
            <AlertBox color="error">
              <p>{errorMessage.text}</p>
            </AlertBox>
          )}
        {loading && <Loading />}
        <DexCardSubmitButton
          label={
            loading ? 'Waiting transaction' : user ? 'Create' : 'Connect wallet'
          }
          onClick={
            user
              ? handleCreateClick
              : () => {
                  connect();
                }
          }
          disabled={loading}
        />
      </DexCardBody>
    </>
  );
}

export default OffersPageCreate;
