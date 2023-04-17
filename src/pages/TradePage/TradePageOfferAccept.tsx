import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import { IconButton } from '@mui/material';
import Countdown from 'react-countdown';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  TransactionID,
  AlertBox,
  OfferPublic,
  Loading,
  PageCard,
  PageCardHeader,
  PageCardBody,
  PageCardSubmitButton,
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
} from '../../store';
import { OfferType } from '../../types';
import { ROUTES } from '../../config';
import { useUserController, useTradeController } from '../../controllers';
import { getChainById, getTokenById, getTokenBySymbol } from '../../utils';

type Props = {};

const TradePageOfferAccept = (props: Props) => {
  let navigate = useNavigate();
  let { offerId } = useParams();
  const dispatch = useAppDispatch();
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
  const { amount, fromChainId, fromTokenId } = filter;
  const fromChain = getChainById(fromChainId, chains);
  const fromToken = getTokenById(fromTokenId, fromChainId, chains);
  const { handleAcceptOfferAction } = useTradeController();
  const offer = foundOffers.find((o: OfferType) => o.offerId === offerId);
  const offerChain = getChainById(offer?.chainId || '', chains);
  const exchangeChain = getChainById(offer?.exchangeChainId || '', chains);
  const exchangeToken = getTokenBySymbol(
    offer?.exchangeToken || '',
    offer?.exchangeChainId || '',
    chains
  );
  const explorerLink = accepted
    ? (exchangeChain?.transactionExplorerUrl || '').replace('{hash}', accepted)
    : '';
  const offerToken = getTokenById(
    offer?.tokenId || '',
    offer?.chainId || '',
    chains
  );

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
        title="Review offer"
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
                    ? approved ||
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
            <AlertBox color="success">
              <p>
                {offer.estimatedTime ? (
                  <>
                    Your order has been placed and is expected to complete
                    within{' '}
                    <Countdown
                      date={
                        Date.now() +
                        (offer.estimatedTime
                          ? parseInt(offer.estimatedTime) * 1000
                          : 0)
                      }
                      renderer={countdownRenderer}
                    />
                    {} seconds. Hang tight.
                  </>
                ) : (
                  <>
                    Your order has been placed and is expected to complete soon.
                    Hang tight.
                  </>
                )}
              </p>
              <TransactionID
                containerStyle={{ marginTop: '10px' }}
                value={accepted}
                label="Transaction ID"
                link={explorerLink}
              />
            </AlertBox>
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
