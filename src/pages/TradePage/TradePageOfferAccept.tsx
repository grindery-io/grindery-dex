import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import { IconButton, Typography } from '@mui/material';
import Countdown from 'react-countdown';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  AlertBox,
  OfferPublic,
  Loading,
  PageCard,
  PageCardHeader,
  PageCardBody,
  PageCardSubmitButton,
  OrderCard,
  TransactionID,
} from '../../components';
import {
  useAppDispatch,
  useAppSelector,
  selectChainsItems,
  selectUserAccessToken,
  selectUserAddress,
  selectUserChainId,
  selectUserId,
  selectTradeAcceptedOfferTx,
  selectTradeApproved,
  selectTradeError,
  selectTradeFilter,
  selectTradeLoading,
  selectTradeOffers,
  setTradeAcceptedOfferTx,
  setTradeApproved,
  selectPoolAbi,
  selectTokenAbi,
  selectUserAdvancedMode,
  selectOrdersItems,
} from '../../store';
import { OfferType, OrderType, TokenType } from '../../types';
import { ROUTES } from '../../config';
import { useUserController, useTradeController } from '../../controllers';
import {
  getChainById,
  getOfferProviderLink,
  getOrderBuyerLink,
  getTokenById,
  getTokenBySymbol,
} from '../../utils';

type Props = {};

const TradePageOfferAccept = (props: Props) => {
  let navigate = useNavigate();
  let { offerId } = useParams();
  const dispatch = useAppDispatch();
  const advancedMode = useAppSelector(selectUserAdvancedMode);
  const user = useAppSelector(selectUserId);
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const userAddress = useAppSelector(selectUserAddress);
  const { connectUser: connect } = useUserController();
  const loading = useAppSelector(selectTradeLoading);
  const foundOffers = useAppSelector(selectTradeOffers);
  const tokenAbi = useAppSelector(selectTokenAbi);
  const poolAbi = useAppSelector(selectPoolAbi);
  const accepted = useAppSelector(selectTradeAcceptedOfferTx);
  const approved = useAppSelector(selectTradeApproved);
  const errorMessage = useAppSelector(selectTradeError);
  const chains = useAppSelector(selectChainsItems);
  const filter = useAppSelector(selectTradeFilter);
  const { amount } = filter;
  const fromChain = getChainById('5', chains);
  const fromToken = fromChain?.tokens?.find(
    (token: TokenType) => token.symbol === fromChain?.nativeToken
  );
  const { handleAcceptOfferAction } = useTradeController();
  const offer = foundOffers.find((o: OfferType) => o.offerId === offerId);
  const offerChain = getChainById(offer?.chainId || '', chains);
  const exchangeToken = getTokenBySymbol(
    offer?.exchangeToken || '',
    offer?.exchangeChainId || '',
    chains
  );
  const offerToken = getTokenById(
    offer?.tokenId || '',
    offer?.chainId || '',
    chains
  );
  const orders = useAppSelector(selectOrdersItems);
  const createdOrder =
    accepted && orders.find((order: OrderType) => order.hash === accepted);

  const providerLink =
    createdOrder && createdOrder?.offer
      ? getOfferProviderLink(createdOrder?.offer, chains)
      : undefined;

  const destAddrLink = createdOrder
    ? getOrderBuyerLink(createdOrder, chains)
    : undefined;

  const renderAddress = (value: string, link: string) => {
    return (
      <TransactionID
        value={value}
        label=""
        link={link}
        containerComponent="span"
        containerStyle={{
          display: 'inline-flex',
          gap: '2px',
        }}
        valueStyle={{
          color: '#000',
          fontSize: '14px',
          fontWeight: '500',
        }}
        startLength={6}
        endLength={4}
        buttonStyle={{
          padding: '0 1px',
        }}
      />
    );
  };

  const countdownRenderer = ({
    total,
    completed,
  }: {
    total: any;
    completed: any;
  }) => {
    if (!createdOrder) {
      return null;
    }
    if (completed) {
      // Render a completed state
      return (
        <>
          <Typography gutterBottom variant="body2">
            You should have received a transfer of {createdOrder.offer?.amount}{' '}
            {createdOrder.offer?.token} on{' '}
            {getChainById(createdOrder.offer?.chainId || '', chains)?.label ||
              ''}{' '}
            from{' '}
            {renderAddress(
              createdOrder.offer?.provider || '',
              providerLink || ''
            )}{' '}
            in your wallet{' '}
            {renderAddress(createdOrder.destAddr || '', destAddrLink || '')}.
            Check your wallet.
          </Typography>
          <Typography variant="body2">
            If you have not received anything within the next 5 minutes, please{' '}
            <a
              style={{ color: '#3f49e1' }}
              href="https://discord.gg/PCMTWg3KzE"
              target="_blank"
              rel="noreferrer"
            >
              visit our Discord
            </a>
            .
          </Typography>
        </>
      );
    } else {
      // Render a countdown
      return (
        <>
          <Typography variant="body2">
            You should receive a transfer of {createdOrder.offer?.amount}{' '}
            {createdOrder.offer?.token} on{' '}
            {getChainById(createdOrder.offer?.chainId || '', chains)?.label ||
              ''}{' '}
            from{' '}
            {renderAddress(
              createdOrder.offer?.provider || '',
              providerLink || ''
            )}{' '}
            within <span>{total / 1000}</span> seconds in your wallet{' '}
            {renderAddress(createdOrder.destAddr || '', destAddrLink || '')}.
          </Typography>
        </>
      );
    }
  };

  return offer ? (
    <PageCard>
      <PageCardHeader
        title={accepted ? 'Your order has been placed!' : 'Review offer'}
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            id="return"
            size="medium"
            edge="start"
            onClick={() => {
              dispatch(setTradeAcceptedOfferTx(''));
              dispatch(setTradeApproved(false));
              navigate(ROUTES.BUY.TRADE.ROOT.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <PageCardBody maxHeight="540px">
        {!accepted ? (
          <>
            <Box mt="0px">
              {offerChain && offerToken && (
                <OfferPublic
                  advancedMode={advancedMode}
                  key={offer._id}
                  chains={chains}
                  offer={offer}
                  fromAmount={amount}
                  fromChain={fromChain}
                  fromToken={fromToken || ''}
                  label="You receive"
                  fromLabel="You pay"
                  userType="a"
                />
              )}
            </Box>
            {approved && (
              <AlertBox color="success">
                <p>
                  Tokens have been approved.
                  <br />
                  You can accept offer now.
                </p>
              </AlertBox>
            )}
            {loading && <Loading />}
            {errorMessage &&
              errorMessage.type === 'acceptOffer' &&
              errorMessage.text && (
                <AlertBox color="error">
                  <p>{errorMessage.text}</p>
                </AlertBox>
              )}
            {exchangeToken && (
              <PageCardSubmitButton
                label={
                  user
                    ? loading
                      ? 'Waiting transaction'
                      : approved ||
                        (typeof fromToken !== 'string' &&
                          fromToken?.address === '0x0')
                      ? 'Place Order'
                      : 'Approve tokens'
                    : 'Connect wallet'
                }
                onClick={
                  user
                    ? () => {
                        handleAcceptOfferAction(
                          offer,
                          accessToken,
                          userChainId,
                          approved,
                          exchangeToken,
                          tokenAbi,
                          poolAbi,
                          userAddress,
                          amount,
                          chains
                        );
                      }
                    : () => {
                        connect();
                      }
                }
                disabled={Boolean(user) && loading}
              />
            )}
          </>
        ) : (
          <>
            {createdOrder && (
              <>
                <OrderCard
                  order={createdOrder}
                  userType="a"
                  chains={chains}
                  excludeSteps={['gas', 'rate', 'time', 'impact']}
                  hideStatus
                  containerStyle={{
                    border: 'none',
                  }}
                />
                <Box sx={{ paddingLeft: '16px', paddingRight: '16px' }}>
                  <Typography variant="h6" gutterBottom>
                    What's next?
                  </Typography>
                  <Countdown
                    date={
                      Date.now() +
                      (createdOrder.offer?.estimatedTime
                        ? parseInt(createdOrder.offer.estimatedTime) * 1000
                        : 0)
                    }
                    renderer={countdownRenderer}
                  />
                </Box>
              </>
            )}
            <PageCardSubmitButton
              label="Close"
              onClick={() => {
                dispatch(setTradeAcceptedOfferTx(''));
                dispatch(setTradeApproved(false));
                navigate(ROUTES.BUY.TRADE.ROOT.FULL_PATH);
              }}
            />
          </>
        )}
      </PageCardBody>
    </PageCard>
  ) : (
    <Navigate to={ROUTES.BUY.FULL_PATH} />
  );
};

export default TradePageOfferAccept;
