import React from 'react';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { Card } from '../../Card';
import { SelectTokenCardHeader } from '../../SelectTokenButton/SelectTokenButton.style';
import { AvatarDefault } from '../../TokenAvatar';
import { StakeBadge } from './DexLiquidityWallet.style';
//import { Remove as RemoveIcon, Add as AddIcon } from '@mui/icons-material';
import { LiquidityWallet } from '../../../types/LiquidityWallet';

type Props = {
  wallet: LiquidityWallet;
  walletChain: any;
  //onWithdrawClick: (wallet: LiquidityWallet) => void;
  //onAddClick: (wallet: LiquidityWallet) => void;
  onClick: (wallet: LiquidityWallet) => void;
};

const DexLiquidityWallet = (props: Props) => {
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

      <SelectTokenCardHeader
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
        action={
          <Box>
            {/*<Tooltip title="Add funds">
              <IconButton
                aria-label="Add funds"
                size="small"
                onClick={() => {
                  onAddClick(wallet);
                }}
              >
                <AddIcon sx={{ color: 'black' }} fontSize="inherit" />
              </IconButton>
            </Tooltip>
            {parseFloat(wallet.balance) > 0 && (
              <Tooltip title="Withdraw">
                <IconButton
                  aria-label="Withdraw"
                  size="small"
                  onClick={() => {
                    onWithdrawClick(wallet);
                  }}
                >
                  <RemoveIcon sx={{ color: 'black' }} fontSize="inherit" />
                </IconButton>
              </Tooltip>
                )}*/}
          </Box>
        }
      />
    </Card>
  );
};

export default DexLiquidityWallet;
