import React from 'react';
import { Avatar, Skeleton, Tooltip } from '@mui/material';
import { ChainCard, ChainContainer } from './ChainsList.style';
import { ChainType } from '../../types';

type Props = {
  chain: string | number;
  chains: any[];
  onClick: (chain: ChainType) => void;
  loading?: boolean;
};

const ChainsList = (props: Props) => {
  const { chain, chains, onClick, loading } = props;
  return (
    <ChainContainer>
      {loading ? (
        <>
          {[0, 1, 2, 3, 4].map((i: number) => (
            <Skeleton
              key={i}
              width={56}
              height={56}
              sx={{ transform: 'initial', borderRadius: '12px' }}
            />
          ))}
        </>
      ) : (
        <>
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
                className="ChainsList__card"
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
        </>
      )}
    </ChainContainer>
  );
};

export default ChainsList;
