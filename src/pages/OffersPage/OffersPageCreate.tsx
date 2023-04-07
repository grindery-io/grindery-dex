import React from 'react';
import { IconButton, Stack } from '@mui/material';
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
import { CardTitle } from '../../components/Card/CardTitle';
import UploadButton from '../../components/UploadButton/UploadButton';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { ROUTES } from '../../config/routes';
import {
  selectUserAccessToken,
  selectUserChainId,
  selectUserId,
} from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';
import {
  clearOffersCreateInput,
  selectOffersCreateInput,
  selectOffersError,
  selectOffersLoading,
} from '../../store/slices/offersSlice';
import { getChainById } from '../../utils/helpers/chainHelpers';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { getTokenById } from '../../utils/helpers/tokenHelpers';
import { useOffersController } from '../../controllers/OffersController';
import { selectPoolAbi } from '../../store/slices/abiSlice';
import useLiquidityWallets from '../../hooks/useLiquidityWallets';
import { LiquidityWalletType } from '../../types/LiquidityWalletType';

function OffersPageCreate() {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserController();
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const loading = useAppSelector(selectOffersLoading);
  const errorMessage = useAppSelector(selectOffersError);
  const input = useAppSelector(selectOffersCreateInput);
  const { handleOfferCreateInputChange, handleOfferCreateAction } =
    useOffersController();
  const poolAbi = useAppSelector(selectPoolAbi);
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
  const { wallets } = useLiquidityWallets();
  const wallet = wallets.find(
    (w: LiquidityWalletType) => w.chainId === fromChainId
  );
  const chains = useAppSelector(selectChainsItems);
  const fromChain = getChainById(fromChainId, chains);
  const fromToken = getTokenById(fromTokenId, fromChainId, chains);
  const toChain = getChainById(toChainId, chains);
  const toToken = getTokenById(toTokenId, toChainId, chains);

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
              dispatch(clearOffersCreateInput());
              navigate(ROUTES.SELL.OFFERS.ROOT.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />

      <DexCardBody maxHeight="540px">
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
            error={errorMessage}
          />
          <SelectChainAndTokenButton
            onClick={() => {
              navigate(ROUTES.SELL.OFFERS.SELECT_TO_CHAIN.FULL_PATH);
            }}
            title="You receive"
            chain={toChain}
            token={toToken || ''}
            error={errorMessage}
            name="toChain"
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
              {fromToken.symbol} order amounts:
            </CardTitle>

            <Box display="flex" flexDirection="row" gap="16px">
              <TextInput
                label="Min. order"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleOfferCreateInputChange('amountMin', event.target.value);
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
                  handleOfferCreateInputChange('amountMax', event.target.value);
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
                handleOfferCreateInputChange('amount', event.target.value);
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
                handleOfferCreateInputChange(
                  'estimatedTime',
                  event.target.value
                );
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
                handleOfferCreateInputChange('title', event.target.value);
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
                handleOfferCreateInputChange('image', img);
              }}
              name="image"
              helpText="Optimal image size 167x174px"
            />
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
                loading
                  ? 'Waiting transaction'
                  : user
                  ? 'Create'
                  : 'Connect wallet'
              }
              onClick={
                user
                  ? () => {
                      handleOfferCreateAction(
                        input,
                        accessToken,
                        userChainId,
                        wallet?.walletAddress || '',
                        poolAbi,
                        chains
                      );
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
      </DexCardBody>
    </>
  );
}

export default OffersPageCreate;
