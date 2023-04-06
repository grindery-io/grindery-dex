import React from 'react';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { Remove as RemoveIcon, Add as AddIcon } from '@mui/icons-material';
import { ChainType } from '../../types/ChainType';
import { Card } from '../Card/Card';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';

export type WalletToken = { label: string; icon: string; amount: string };

type Props = {
  token: WalletToken;
  tokenChain: ChainType | undefined;
  onWithdrawClick: (token: WalletToken) => void;
  onAddClick: (token: WalletToken) => void;
};

const LiquidityWalletToken = (props: Props) => {
  const { token, onWithdrawClick, onAddClick } = props;

  return (
    <Card
      flex={1}
      style={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: '#fff',
      }}
    >
      <ChainTokenBox
        style={{ height: 'auto' }}
        avatar={
          token ? (
            <Avatar src={token.icon} alt={token.label}>
              {token.label}
            </Avatar>
          ) : (
            <AvatarDefault width={32} height={32} />
          )
        }
        title={token.amount}
        subheader={token.label}
        selected={true}
        compact={false}
        action={
          <Box>
            <Tooltip title="Add funds">
              <IconButton
                aria-label="Add funds"
                size="small"
                onClick={() => {
                  onAddClick(token);
                }}
              >
                <AddIcon sx={{ color: 'black' }} fontSize="inherit" />
              </IconButton>
            </Tooltip>
            {parseFloat(token.amount) > 0 && (
              <Tooltip title="Withdraw">
                <IconButton
                  aria-label="Withdraw"
                  size="small"
                  onClick={() => {
                    onWithdrawClick(token);
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

export default LiquidityWalletToken;
