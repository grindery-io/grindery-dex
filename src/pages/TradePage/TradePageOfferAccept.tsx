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
import { getChainById, getTokenById, getTokenBySymbol } from '../../utils';

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
  const fromChain = getChainById(userChainId, chains);
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

  const countdownRenderer = ({
    total,
    completed,
  }: {
    total: any;
    completed: any;
  }) => {
    if (completed) {
      // Render a completed state
      return <span>0</span>;
    } else {
      // Render a countdown
      return <span>{total / 1000}</span>;
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
                          amount
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
                  <Typography gutterBottom variant="body2">
                    You should receive a transfer of{' '}
                    {createdOrder.offer?.amount} {createdOrder.offer?.token} on{' '}
                    {getChainById(createdOrder.offer?.chainId || '', chains)
                      ?.label || ''}{' '}
                    from{' '}
                    {(createdOrder.offer?.provider || '').substring(0, 6) +
                      '...' +
                      (createdOrder.offer?.provider || '').substring(
                        (createdOrder.offer?.provider || '').length - 4
                      )}{' '}
                    within{' '}
                    <Countdown
                      date={
                        Date.now() +
                        (createdOrder.offer?.estimatedTime
                          ? parseInt(createdOrder.offer.estimatedTime) * 1000
                          : 0)
                      }
                      renderer={countdownRenderer}
                    />{' '}
                    seconds.
                  </Typography>
                  <Typography variant="body2">
                    If you have not received anything within 5 minutes, please{' '}
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
