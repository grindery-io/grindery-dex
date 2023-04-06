import React from 'react';
import { Avatar } from '@mui/material';
import { Box } from '@mui/system';
import { StakeBadge } from './LiquidityWallet.style';
import { LiquidityWalletType } from '../../types/LiquidityWalletType';
import { Card } from '../Card/Card';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';

type Props = {
  wallet: LiquidityWalletType;
  walletChain: any;
  onClick: (wallet: LiquidityWalletType) => void;
};

const LiquidityWallet = (props: Props) => {
  const { wallet, walletChain, onClick } = props;
  return (
    <Card
      flex={1}
      sx={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: wallet.new ? 'rgba(245, 181, 255, 0.08)' : '#fff',
        '&:hover': {
          backgroundColor: 'rgb(249, 249, 249)',
        },
      }}
      onClick={() => {
        onClick(wallet);
      }}
    >
      {(wallet.new || wallet.updated) && (
        <Box>
          {wallet.new && <StakeBadge>New</StakeBadge>}

          {wallet.updated && (
            <StakeBadge className="secondary">Updated</StakeBadge>
          )}
        </Box>
      )}

      <ChainTokenBox
        sx={{
          height: 'auto',
          '& .MuiCardHeader-content': { overflow: 'hidden' },
        }}
        avatar={
          walletChain ? (
            <Avatar src={walletChain.icon} alt={walletChain.label}>
              {walletChain.label}
            </Avatar>
          ) : (
            <AvatarDefault width={32} height={32} />
          )
        }
        title={`${walletChain.label} chain wallet`}
        subheader={Object.keys(wallet.tokens)
          .map(
            (key: string) =>
              `${key}: ${parseFloat(wallet.tokens[key] || '0')
                .toFixed(4)
                .toLocaleString()}`
          )
          .join(' ⋅ ')}
        selected={true}
        compact={false}
      />
    </Card>
  );
};

export default LiquidityWallet;
