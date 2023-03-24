import React from 'react';
import { Avatar, Badge, FormHelperText } from '@mui/material';
import { Chain } from '../../types/Chain';
import { TokenType } from '../../types/TokenType';
import { Card } from '../Card/Card';
import { CardTitle } from '../Card/CardTitle';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';
type Props = {
  onClick?: () => void;
  title: string;
  chain?: Chain | null;
  token: TokenType | '';
  error: {
    type: string;
    text: string;
  };
  name?: string;
};

const SelectChainAndTokenButton = (props: Props) => {
  const { onClick, title, chain, token, error, name } = props;
  return (
    <Card flex={1} onClick={onClick} style={{ borderRadius: '12px' }}>
      <CardTitle>{title}</CardTitle>

      <ChainTokenBox
        style={{ height: 'auto' }}
        avatar={
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            badgeContent={
              chain && token ? (
                <Avatar
                  sx={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #fff',
                    background: '#fff',
                  }}
                  src={chain.icon}
                  alt={chain.label}
                >
                  {chain.nativeToken}
                </Avatar>
              ) : (
                <AvatarDefault
                  width={16}
                  height={16}
                  sx={{ border: '2px solid #fff' }}
                />
              )
            }
          >
            {chain && token && token.icon ? (
              <Avatar
                sx={{ width: '32px', height: '32px' }}
                src={token.icon}
                alt={token.symbol || token.address}
              >
                {token.symbol || token.address}
              </Avatar>
            ) : (
              <AvatarDefault width={32} height={32} />
            )}
          </Badge>
        }
        title={
          token && chain
            ? token?.symbol || token?.address
            : 'Select chain and token'
        }
        subheader={token && chain ? `on ${chain.label}` : null}
        selected={Boolean(token && chain)}
        compact={false}
      />
      {!name ? (
        <>
          {error.type === 'chain' && !!error.text && (
            <FormHelperText
              style={{
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingBottom: '6px',
              }}
              error={true}
            >
              {error.type === 'chain' && !!error.text ? error.text : ''}
            </FormHelperText>
          )}
        </>
      ) : (
        <>
          {error.type === name && !!error.text && (
            <FormHelperText
              style={{
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingBottom: '6px',
              }}
              error={true}
            >
              {error.type === name && !!error.text ? error.text : ''}
            </FormHelperText>
          )}
        </>
      )}
    </Card>
  );
};

export default SelectChainAndTokenButton;
