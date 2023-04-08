import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import Loading from '../../components/Loading/Loading';
import DexCardBody from '../../components/DexCard/DexCardBody';
import OfferPublic from '../../components/Offer/OfferPublic';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Countdown from 'react-countdown';
import { IconButton } from '@mui/material';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import AlertBox from '../../components/AlertBox/AlertBox';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { OfferType } from '../../types/OfferType';
import { ROUTES } from '../../config/routes';
import {
  selectUserAccessToken,
  selectUserAddress,
  selectUserChainId,
  selectUserId,
} from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';
import {
  selectTradeAcceptedOfferTx,
  selectTradeApproved,
  selectTradeError,
  selectTradeFilter,
  selectTradeLoading,
  selectTradeOffers,
  setTradeAcceptedOfferTx,
  setTradeApproved,
} from '../../store/slices/tradeSlice';
import { getChainById } from '../../utils/helpers/chainHelpers';
import {
  getTokenById,
  getTokenBySymbol,
} from '../../utils/helpers/tokenHelpers';
import TransactionID from '../../components/TransactionID/TransactionID';
import { useTradeController } from '../../controllers/TradeController';
import { selectPoolAbi, selectTokenAbi } from '../../store/slices/abiSlice';

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
    <DexCard>
      <DexCardHeader
        title="Review offer"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
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
      <DexCardBody maxHeight="540px">
        {!accepted ? (
          <>
            <Box mt="0px">
              {offerChain && offerToken && (
                <OfferPublic
                  key={offer._id}
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
              <DexCardSubmitButton
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
            <DexCardSubmitButton
              label="Close"
              onClick={() => {
                dispatch(setTradeAcceptedOfferTx(''));
                dispatch(setTradeApproved(false));
                navigate(ROUTES.BUY.TRADE.ROOT.FULL_PATH);
              }}
            />
          </>
        )}
      </DexCardBody>
    </DexCard>
  ) : (
    <Navigate to="/buy" />
  );
};

export default TradePageOfferAccept;
