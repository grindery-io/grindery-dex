import React from 'react';
import { Avatar, Tooltip } from '@mui/material';
import { ChainCard, ChainContainer } from './DexChainsList.style';

type Props = {
  chain: string | number;
  chains: any[];
  onClick: (chain: any) => void;
};

const DexChainsList = (props: Props) => {
  const { chain, chains, onClick } = props;
  return (
    <ChainContainer style={{ paddingLeft: '24px', paddingRight: '24px' }}>
      {chains.map((blockchain: any) => (
        <Tooltip
          key={blockchain.value}
          title={blockchain.label}
          placement="top"
          enterDelay={400}
          arrow
        >
          <ChainCard
            onClick={() => {
              onClick(blockchain);
            }}
            variant={chain === blockchain.value ? 'selected' : 'default'}
            style={{ borderRadius: '12px' }}
          >
            <Avatar
              src={blockchain.icon}
              alt={blockchain.label}
              sx={{ width: 40, height: 40 }}
            >
              {blockchain.label}
            </Avatar>
          </ChainCard>
        </Tooltip>
      ))}
    </ChainContainer>
  );
};

export default DexChainsList;
