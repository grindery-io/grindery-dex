import React from 'react';
import { IconButton, Stack } from '@mui/material';
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
import AmountInput from '../../components/AmountInput/AmountInput';
import UploadButton from '../../components/UploadButton/UploadButton';

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
    toChain,
    toToken,
    currentToChain,
    title,
    setTitle,
    image,
    setImage,
    amount,
    setAmount,
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
        <Stack
          direction="row"
          alignItems="stretch"
          justifyContent="space-between"
          gap="16px"
        >
          <SelectChainAndTokenButton
            onClick={() => {
              navigate(VIEWS.SELECT_CHAIN.fullPath);
            }}
            title="You sell"
            chain={currentChain}
            token={token}
            error={errorMessage}
          />
          <SelectChainAndTokenButton
            onClick={() => {
              navigate(VIEWS.SELECT_TO_CHAIN.fullPath);
            }}
            title="You receive"
            chain={currentToChain}
            token={toToken}
            error={errorMessage}
            name="toChain"
          />
        </Stack>

        {token && toToken && (
          <>
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
            <Stack
              direction="row"
              alignItems="stretch"
              justifyContent="space-between"
              gap="16px"
            >
              <TextInput
                label={`${token.symbol} value`}
                value={'1'}
                onChange={() => {}}
                name="sellRate"
                placeholder="0"
                disabled={false}
                sx={{ marginTop: 0 }}
                readOnly
              />
              <TextInput
                label={`${toToken.symbol} value`}
                value={exchangeRate}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setErrorMessage({
                    type: '',
                    text: '',
                  });
                  setExchangeRate(event.target.value);
                }}
                name="exchangeRate"
                placeholder="1"
                disabled={false}
                error={errorMessage}
                sx={{ marginTop: 0 }}
              />
            </Stack>

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
                placeholder="0.1"
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
                placeholder="10"
                disabled={false}
                error={errorMessage}
                sx={{ marginTop: 0 }}
              />
            </Box>
            <TextInput
              label={`Fixed amount`}
              value={amount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setErrorMessage({
                  type: '',
                  text: '',
                });
                setAmount(event.target.value);
              }}
              name="amount"
              placeholder="1"
              disabled={false}
              error={errorMessage}
              helpText="Optional"
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
              placeholder="60"
              disabled={false}
              error={errorMessage}
              helpText="Seconds"
            />
            <TextInput
              label={`Offer title`}
              value={title}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setErrorMessage({
                  type: '',
                  text: '',
                });
                setTitle(event.target.value);
              }}
              name="title"
              placeholder="Describe your offer"
              disabled={false}
              error={errorMessage}
              helpText="Optional"
            />

            <UploadButton
              label="Offer image"
              value={image}
              onChange={(img: string) => {
                setImage(img);
              }}
              name="image"
              helpText="Optimal image size 128x128px"
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
