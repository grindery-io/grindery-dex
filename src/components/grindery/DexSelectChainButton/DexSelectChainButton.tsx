import { Avatar } from '@mui/material';
import React from 'react';
import { Chain } from '../../../types/Chain';
import { Card, CardTitle } from '../../Card';
import { SelectTokenCardHeader } from '../../SelectTokenButton/SelectTokenButton.style';
import { AvatarDefault } from '../../TokenAvatar';

type Props = {
  title: string;
  onClick: () => void;
  chain?: Chain | null;
};

const DexSelectChainButton = (props: Props) => {
  const { title, onClick, chain } = props;
  return (
    <Card flex={1} onClick={onClick} style={{ borderRadius: '12px' }}>
      <CardTitle>{title}</CardTitle>

      <SelectTokenCardHeader
        style={{ height: 'auto' }}
        avatar={
          chain ? (
            <Avatar src={chain.icon} alt={chain.label}>
              {chain.nativeToken}
            </Avatar>
          ) : (
            <AvatarDefault width={32} height={32} />
          )
        }
        title={chain?.label || 'Select blockchain'}
        subheader={null}
        selected={!!chain}
        compact={false}
      />
    </Card>
  );
};

export default DexSelectChainButton;
