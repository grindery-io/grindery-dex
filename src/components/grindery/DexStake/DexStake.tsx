import { Avatar, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Card } from '../../Card';
import { SelectTokenCardHeader } from '../../SelectTokenButton/SelectTokenButton.style';
import { AvatarDefault } from '../../TokenAvatar';
import { StakeBadge } from './DexStake.style';
import { SaveAlt as SaveAltIcon } from '@mui/icons-material';
import { Stake } from '../../../types/Stake';

type Props = {
  stake: Stake;
  stakeChain: any;
  onWithdrawClick: (stake: Stake) => void;
};

const DexStake = (props: Props) => {
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

      <SelectTokenCardHeader
        style={{ height: 'auto' }}
        avatar={
          stakeChain ? (
            <Avatar src={stakeChain.icon} alt={stakeChain.label}>
              {stakeChain.nativeToken}
            </Avatar>
          ) : (
            <AvatarDefault width={32} height={32} />
          )
        }
        title={parseFloat(stake.amount).toLocaleString()}
        subheader={`GST on ${stakeChain.label}`}
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
                  <SaveAltIcon sx={{ color: 'black' }} fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
      />
    </Card>
  );
};

export default DexStake;
