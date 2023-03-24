import React from 'react';
import { Avatar, FormHelperText } from '@mui/material';
import { TokenType } from '../../types/TokenType';
import { Card } from '../Card/Card';
import { CardTitle } from '../Card/CardTitle';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';

type Props = {
  onClick: () => void;
  title: string;
  token: TokenType | '';
  error: {
    type: string;
    text: string;
  };
};

const SelectTokenButton = (props: Props) => {
  const { onClick, title, token, error } = props;

  return (
    <Card flex={1} onClick={onClick} style={{ borderRadius: '12px' }}>
      <CardTitle>{title}</CardTitle>

      <ChainTokenBox
        style={{ height: 'auto' }}
        avatar={
          token ? (
            <Avatar src={token?.icon} alt={token?.symbol}>
              {token?.symbol}
            </Avatar>
          ) : (
            <AvatarDefault width={32} height={32} />
          )
        }
        title={(token && token?.symbol) || 'Select token'}
        subheader={null}
        selected={!!token}
        compact={false}
      />
      {error.type === 'token' && !!error.text && (
        <FormHelperText
          style={{
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingBottom: '6px',
          }}
          error={true}
        >
          {error.type === 'token' && !!error.text ? error.text : ''}
        </FormHelperText>
      )}
    </Card>
  );
};

export default SelectTokenButton;
