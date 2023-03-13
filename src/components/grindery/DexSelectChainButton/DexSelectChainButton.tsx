import { Avatar, FormHelperText } from '@mui/material';
import React from 'react';
import { Chain } from '../../../types/Chain';
import { Card, CardTitle } from '../../Card';
import { SelectTokenCardHeader } from '../../SelectTokenButton/SelectTokenButton.style';
import { AvatarDefault } from '../../TokenAvatar';

type Props = {
  title: string;
  onClick: () => void;
  chain?: Chain | null;
  error?: {
    type: string;
    text: string;
  };
};

const DexSelectChainButton = (props: Props) => {
  const { title, onClick, chain, error } = props;
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
      {error && error.type === 'chain' && !!error.text && (
        <FormHelperText
          style={{
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingBottom: '6px',
          }}
          error={true}
        >
          {error && error.type === 'chain' && !!error.text ? error.text : ''}
        </FormHelperText>
      )}
    </Card>
  );
};

export default DexSelectChainButton;
