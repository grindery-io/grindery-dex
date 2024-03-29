import React from 'react';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { StakeBadge } from './Stake.style';
import { Remove as RemoveIcon } from '@mui/icons-material';
import { StakeType, ChainType } from '../../types';
import { Card } from '../Card/Card';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';

type Props = {
  stake: StakeType;
  stakeChain: ChainType;
  onWithdrawClick: (stake: StakeType) => void;
};

const Stake = (props: Props) => {
  const { stake, stakeChain, onWithdrawClick } = props;
  return (
    <Card
      flex={1}
      style={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: stake.new ? 'rgba(245, 181, 255, 0.08)' : '#fff',
      }}
    >
      {(stake.new || stake.updated) && (
        <Box>
          {stake.new && <StakeBadge>New</StakeBadge>}

          {stake.updated && (
            <StakeBadge className="secondary">Updated</StakeBadge>
          )}
        </Box>
      )}

      <ChainTokenBox
        style={{ height: 'auto' }}
        avatar={
          stakeChain ? (
            <Avatar src={stakeChain.icon} alt={stakeChain.label}>
              {stakeChain.token}
            </Avatar>
          ) : (
            <AvatarDefault width={32} height={32} />
          )
        }
        title={parseFloat(stake.amount).toLocaleString()}
        subheader={`GRT on ${stakeChain.label}`}
        selected={true}
        compact={false}
        action={
          <Box>
            {parseFloat(stake.amount) > 0 && (
              <Tooltip title="Withdraw">
                <IconButton
                  aria-label="Withdraw"
                  size="small"
                  onClick={() => {
                    onWithdrawClick(stake);
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

export default Stake;
