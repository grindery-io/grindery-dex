import React, { useEffect, useState } from 'react';
import { OrderType } from '../../types/Order';
import {
  Avatar,
  Badge,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useOffers from '../../hooks/useOffers';
import { Offer } from '../../types/Offer';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { Chain } from '../../types/Chain';
import { TokenType } from '../../types/TokenType';
import moment from 'moment';
import CheckIcon from '@mui/icons-material/Check';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DexCardSubmitButton from '../DexCard/DexCardSubmitButton';
//import useOrders from '../../hooks/useOrders';
import { Card } from '../Card/Card';
import { CardTitle } from '../Card/CardTitle';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';
import AlertBox from '../AlertBox/AlertBox';

type Props = {
  order: OrderType;
  userType: 'a' | 'b';
  onCompleteClick?: (order: OrderType) => Promise<boolean>;
  error?: string;
};

const Order = (props: Props) => {
  const { order, userType, onCompleteClick, error } = props;
  const { getOfferById } = useOffers();
  const [offer, setOffer] = useState<Offer | false>(false);
  const { chains } = useGrinderyChains();
  const [loading, setLoading] = useState(false);
  const isUserA = userType === 'a';

  const fromChain = chains.find(
    (c: Chain) => c.chainId === order.chainIdTokenDeposit
  );

  const fromToken = fromChain?.tokens?.find(
    (t: TokenType) => t.address === order.addressTokenDeposit
  );

  const offerChain = chains.find(
    (c: Chain) => offer && c.chainId === offer.chainId
  );
  const offerToken = chains
    .find((c: Chain) => offer && c.chainId === offer.chainId)
    ?.tokens?.find(
      (t: TokenType) => offer && t.coinmarketcapId === offer.tokenId
    );

  const getOffer = async () => {
    if (order.offerId) {
      const offerRes = await getOfferById(order.offerId);
      setOffer(offerRes);
    }
  };

  const handleCompleteClick = async () => {
    if (order.orderId && onCompleteClick) {
      setLoading(true);
      const res = await onCompleteClick(order);
      if (res) {
        // handle success
      } else {
        // handle fail
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getOffer();
  }, [order.offerId]);

  return (
    <Card
      flex={1}
      style={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: '#fff',
      }}
    >
      <Stack
        direction="row"
        sx={{ margin: '16px 16px 0' }}
        justifyContent="space-between"
        alignItems="center"
      >
        {order.date && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            {moment(order.date).format('MMMM Do YYYY, h:mm:ss a')}
          </Typography>
        )}
        {order.isComplete ? (
          <Chip
            icon={<CheckIcon />}
            label="Complete"
            color="success"
            size="small"
          />
        ) : (
          <Chip icon={<HourglassTopIcon />} label="Pending" size="small" />
        )}
      </Stack>
      <CardTitle sx={{ paddingTop: '12px' }}>
        {isUserA ? 'You pay' : 'You receive'}
      </CardTitle>
      <ChainTokenBox
        style={{ height: 'auto' }}
        avatar={
          <Avatar
            src={fromToken?.icon || ''}
            alt={fromToken?.symbol || ''}
            sx={{
              width: '32px',
              height: '32px',
              background: '#fff',
            }}
          >
            {fromToken?.symbol || ''}
          </Avatar>
        }
        title={
          <Box
            style={{
              whiteSpace: 'pre-wrap',
              color: '#000',
            }}
            mb={'3px'}
          >
            {parseFloat(order.amountTokenDeposit).toFixed(6).toLocaleString()}
          </Box>
        }
        subheader={
          fromToken?.symbol && fromChain?.label ? (
            <span style={{ whiteSpace: 'pre-wrap' }}>
              {fromToken?.symbol || ''} on {fromChain?.label || ''}
            </span>
          ) : undefined
        }
        selected={true}
        compact={false}
      />
      <CardTitle sx={{ paddingTop: '0px' }}>
        {isUserA ? 'You receive' : 'You pay'}
      </CardTitle>
      <ChainTokenBox
        style={{ height: 'auto' }}
        avatar={
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            badgeContent={
              offerChain && offerChain.label ? (
                <Avatar
                  src={offerChain.icon}
                  alt={offerChain.label}
                  sx={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #fff',
                    background: '#fff',
                  }}
                >
                  {offerChain.label}
                </Avatar>
              ) : (
                <AvatarDefault
                  width={16}
                  height={16}
                  sx={{ border: '2px solid #fff' }}
                />
              )
            }
          >
            {offerToken ? (
              <Avatar
                sx={{ width: '32px', height: '32px' }}
                src={offerToken.icon}
                alt={offerToken.symbol || ''}
              >
                {offerToken.symbol || ''}
              </Avatar>
            ) : (
              <AvatarDefault width={32} height={32} />
            )}
          </Badge>
        }
        title={
          <Box
            style={{
              whiteSpace: 'pre-wrap',
              color: '#000',
            }}
            mb={'3px'}
          >
            {parseFloat(order.amountTokenOffer).toFixed(6).toLocaleString()}
          </Box>
        }
        subheader={
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {offerToken && offerChain ? (
              `${offerToken.symbol} on ${offerChain.label}`
            ) : (
              <Skeleton width="150px" />
            )}
          </span>
        }
        selected={true}
        compact={false}
      />
      {error && (
        <Box sx={{ margin: '0 16px' }}>
          <AlertBox color="error" wrapperStyle={{ margin: '10px 0' }}>
            <p style={{ fontSize: '14px' }}>{error}</p>
          </AlertBox>
        </Box>
      )}
      {!order.isComplete && !isUserA && (
        <Box
          sx={{
            padding: '0 16px',
            '& button': { margin: 0, fontSize: '13px', padding: '8px 20px' },
          }}
        >
          <DexCardSubmitButton
            disabled={loading}
            label={loading ? 'Paying' : 'Pay'}
            onClick={() => {
              handleCompleteClick();
            }}
          />
        </Box>
      )}
    </Card>
  );
};

export default Order;
