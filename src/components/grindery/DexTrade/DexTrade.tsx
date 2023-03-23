import React, { useEffect, useState } from 'react';
import { Card, CardTitle } from '../../Card';
import { Trade } from '../../../types/Trade';
import { SelectTokenCardHeader } from '../../SelectTokenButton/SelectTokenButton.style';
import {
  Avatar,
  Badge,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useOffers from '../../../hooks/useOffers';
import { Offer } from '../../../types/Offer';
import useGrinderyChains from '../../../hooks/useGrinderyChains';
import { Chain } from '../../../types/Chain';
import { TokenType } from '../../../types/TokenType';
import { AvatarDefault } from '../../TokenAvatar';
import moment from 'moment';
import CheckIcon from '@mui/icons-material/Check';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DexCardSubmitButton from '../DexCard/DexCardSubmitButton';
import useTrades from '../../../hooks/useTrades';

type Props = {
  trade: Trade;
};

const DexTrade = (props: Props) => {
  const { trade } = props;
  const { completeTrade } = useTrades();
  const { getOfferById } = useOffers();
  const [offer, setOffer] = useState<Offer | false>(false);
  const { chains } = useGrinderyChains();
  const [loading, setLoading] = useState(false);

  const fromToken = {
    symbol: 'ETH',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  };

  const offerChain = chains.find(
    (c: Chain) => offer && c.value.split(':')[1] === offer.chainId
  );
  const offerToken = chains
    .find((c: Chain) => offer && c.value.split(':')[1] === offer.chainId)
    ?.tokens?.find((t: TokenType) => offer && t.id === offer.tokenId);

  const getOffer = async () => {
    if (trade.offerId) {
      const offerRes = await getOfferById(trade.offerId);
      setOffer(offerRes);
    }
  };

  const handleCompleteClick = async () => {
    if (trade.tradeId) {
      setLoading(true);
      const res = await completeTrade(trade.tradeId);
      setLoading(false);
    }
  };

  useEffect(() => {
    getOffer();
  }, [trade.offerId]);

  console.log('trade', trade);

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
      >
        {trade.date && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            {moment(trade.date).format('MMMM Do YYYY, h:mm:ss a')}
          </Typography>
        )}
        {trade.isComplete ? (
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
      <CardTitle sx={{ paddingTop: '12px' }}>You paid</CardTitle>
      <SelectTokenCardHeader
        style={{ height: 'auto' }}
        avatar={
          <Avatar
            src={fromToken.icon}
            alt={fromToken.symbol}
            sx={{
              width: '32px',
              height: '32px',
              background: '#fff',
            }}
          >
            {fromToken.symbol}
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
            {parseFloat(trade.amountGRT).toLocaleString()}
          </Box>
        }
        subheader={
          <span style={{ whiteSpace: 'pre-wrap' }}>{fromToken.symbol}</span>
        }
        selected={true}
        compact={false}
      />
      <CardTitle sx={{ paddingTop: '0px' }}>You received</CardTitle>
      <SelectTokenCardHeader
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
            {parseFloat(trade.amountToken).toLocaleString()}
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
      {!trade.isComplete && (
        <Box
          sx={{
            padding: '0 16px',
            '& button': { margin: 0, fontSize: '13px', padding: '8px 20px' },
          }}
        >
          <DexCardSubmitButton
            disabled={loading}
            label={loading ? 'Saving' : 'Confirm received tokens'}
            onClick={() => {
              handleCompleteClick();
            }}
          />
        </Box>
      )}
    </Card>
  );
};

export default DexTrade;
