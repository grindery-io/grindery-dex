import { Avatar, Badge, Box, FormHelperText } from '@mui/material';
import React from 'react';
import { Chain } from '../../../types/Chain';
import { TokenType } from '../../../types/TokenType';
import { Card, CardTitle } from '../../Card';
import { AvatarDefault } from '../../TokenAvatar';
import { FormControl, Input } from './DexAmountInput.style';

type Props = {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  disabled?: boolean;
  error?: {
    type: string;
    text: string;
  };
  placeholder?: string;
  endAdornment?: React.ReactNode;
  chain?: Chain | null;
  token?: TokenType | '';
  disableTopMargin?: boolean;
  helpText?: string | React.ReactNode;
};

const DexAmountInput = (props: Props) => {
  const {
    label,
    value,
    onChange,
    name,
    disabled,
    error,
    placeholder,
    endAdornment,
    chain,
    token,
    disableTopMargin,
    helpText,
  } = props;
  return (
    <Card
      style={{
        borderRadius: '12px',
        marginTop: !disableTopMargin ? '20px' : '0px',
      }}
    >
      <CardTitle>{label}</CardTitle>
      <Box
        display="flex"
        flexDirection="row"
        padding="12px 0 8px 16px"
        alignItems="center"
      >
        <Box style={{ position: 'relative' }}>
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
        </Box>
        <FormControl fullWidth sx={{ paddingTop: '6px', paddingBottom: '5px' }}>
          <Input
            size="small"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={value}
            onChange={onChange}
            name={name}
            placeholder={placeholder || ''}
            disabled={disabled}
            style={{ padding: `0px ${endAdornment ? '0px' : '16px'} 0px 0` }}
            endAdornment={endAdornment}
            sx={{
              fontSize: '20px',
              fontWeight: '500',
            }}
          />
          {helpText && (
            <FormHelperText
              sx={{ paddingLeft: '5px', marginTop: 0, lineHeight: 1.4 }}
            >
              {helpText}
            </FormHelperText>
          )}
          <FormHelperText error={error && error.type === name && !!error.text}>
            {error && error.type === name && !!error.text ? error.text : ''}
          </FormHelperText>
        </FormControl>
      </Box>
    </Card>
  );
};

export default DexAmountInput;
