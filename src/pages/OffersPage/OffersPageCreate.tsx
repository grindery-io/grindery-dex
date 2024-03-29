import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  CardTitle,
  AlertBox,
  SelectChainAndTokenButton,
  TextInput,
  Loading,
  UploadButton,
  PageCardHeader,
  PageCardBody,
  PageCardSubmitButton,
} from '../../components';
import {
  useAppDispatch,
  useAppSelector,
  selectChainsStore,
  selectOffersStore,
  offersStoreActions,
  selectUserStore,
} from '../../store';
import { ROUTES } from '../../config';
import { useUserProvider, useOffersProvider } from '../../providers';
import { getChainById, getTokenById } from '../../utils';

function OffersPageCreate() {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id: user } = useAppSelector(selectUserStore);
  const { connectUser: connect } = useUserProvider();
  const { error, input, loading } = useAppSelector(selectOffersStore);
  const { handleOfferCreateInputChange, handleOfferCreateAction } =
    useOffersProvider();
  const {
    amountMin,
    amountMax,
    exchangeRate,
    estimatedTime,
    title,
    image,
    amount,
    fromChainId,
    fromTokenId,
    toChainId,
    toTokenId,
  } = input;
  const { items: chains } = useAppSelector(selectChainsStore);
  const fromChain = getChainById(fromChainId, chains);
  const fromToken = getTokenById(fromTokenId, fromChainId, chains);
  const toChain = getChainById(toChainId, chains);
  const toToken = getTokenById(toTokenId, toChainId, chains);

  return (
    <>
      <PageCardHeader
        title="Create offer"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              dispatch(offersStoreActions.clearInput());
              navigate(ROUTES.SELL.OFFERS.ROOT.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />

      <PageCardBody maxHeight="540px">
        <Stack
          direction="row"
          alignItems="stretch"
          justifyContent="space-between"
          gap="16px"
        >
          <SelectChainAndTokenButton
            onClick={() => {
              navigate(ROUTES.SELL.OFFERS.SELECT_CHAIN.FULL_PATH);
            }}
            title="You sell"
            chain={fromChain}
            token={fromToken || ''}
            error={error}
            id="sell-button"
          />
          <SelectChainAndTokenButton
            onClick={() => {
              navigate(ROUTES.SELL.OFFERS.SELECT_TO_CHAIN.FULL_PATH);
            }}
            title="You receive"
            chain={toChain}
            token={toToken || ''}
            error={error}
            name="toChain"
            id="receive-button"
          />
        </Stack>

        {fromToken && toToken ? (
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
                label={`${fromToken.symbol} value`}
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
                  handleOfferCreateInputChange(
                    'exchangeRate',
                    event.target.value
                  );
                }}
                name="exchangeRate"
                placeholder="1"
                disabled={false}
                error={error}
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
              {fromToken.symbol} order amounts:
            </CardTitle>

            <Box display="flex" flexDirection="row" gap="16px">
              <TextInput
                label={`Min ${fromToken.symbol}`}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleOfferCreateInputChange('amountMin', event.target.value);
                }}
                name="amountMin"
                placeholder="0.1"
                disabled={false}
                value={amountMin}
                error={error}
                sx={{ marginTop: 0 }}
              />
              <TextInput
                label={`Max ${fromToken.symbol}`}
                value={amountMax}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleOfferCreateInputChange('amountMax', event.target.value);
                }}
                name="amountMax"
                placeholder="10"
                disabled={false}
                error={error}
                sx={{ marginTop: 0 }}
              />
            </Box>
            <TextInput
              label={`Fixed amount`}
              value={amount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleOfferCreateInputChange('amount', event.target.value);
              }}
              name="amount"
              placeholder="1"
              disabled={false}
              error={error}
              helpText="Optional"
            />
            <TextInput
              label={`Average execution time`}
              value={estimatedTime}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleOfferCreateInputChange(
                  'estimatedTime',
                  event.target.value
                );
              }}
              name="estimatedTime"
              placeholder="60"
              disabled={false}
              error={error}
              helpText="Seconds"
            />
            <TextInput
              label={`Offer title`}
              value={title}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleOfferCreateInputChange('title', event.target.value);
              }}
              name="title"
              placeholder="Describe your offer"
              disabled={false}
              error={error}
              helpText="Optional"
            />

            <UploadButton
              label="Offer image"
              value={image}
              onChange={(img: string) => {
                handleOfferCreateInputChange('image', img);
              }}
              name="image"
              helpText="Optimal image size 167x174px"
            />
            {error && error.type === 'saveOffer' && error.text && (
              <AlertBox color="error">
                <p>{error.text}</p>
              </AlertBox>
            )}
            {loading && <Loading />}
            <PageCardSubmitButton
              label={
                loading
                  ? 'Confirm transaction'
                  : user
                  ? 'Create'
                  : 'Connect wallet'
              }
              onClick={
                user
                  ? () => {
                      handleOfferCreateAction();
                    }
                  : () => {
                      connect();
                    }
              }
              disabled={loading}
            />
          </>
        ) : (
          <Box height="20px" />
        )}
      </PageCardBody>
    </>
  );
}

export default OffersPageCreate;
