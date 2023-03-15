import React from 'react';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { Card } from '../../Card';
import { SelectTokenCardHeader } from '../../SelectTokenButton/SelectTokenButton.style';
import { AvatarDefault } from '../../TokenAvatar';
import { StakeBadge } from './DexLiquidityWallet.style';
import { Remove as RemoveIcon, Add as AddIcon } from '@mui/icons-material';
import { LiquidityWallet } from '../../../types/LiquidityWallet';

type Props = {
  wallet: LiquidityWallet;
  walletChain: any;
  onWithdrawClick: (wallet: LiquidityWallet) => void;
  onAddClick: (wallet: LiquidityWallet) => void;
};

const DexLiquidityWallet = (props: Props) => {
  const { wallet, walletChain, onWithdrawClick, onAddClick } = props;
  return (
    <Card
      flex={1}
      style={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: wallet.new ? 'rgba(245, 181, 255, 0.08)' : '#fff',
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
        style={{ height: 'auto' }}
        avatar={
          walletChain ? (
            <Avatar src={walletChain.icon} alt={walletChain.label}>
              {walletChain.nativeToken}
            </Avatar>
          ) : (
            <AvatarDefault width={32} height={32} />
          )
        }
        title={parseFloat(wallet.balance).toLocaleString()}
        subheader={`GST on ${walletChain.label}`}
        selected={true}
        compact={false}
        action={
          <Box>
            <Tooltip title="Add funds">
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
            )}
          </Box>
        }
      />
    </Card>
  );
};

export default DexLiquidityWallet;
