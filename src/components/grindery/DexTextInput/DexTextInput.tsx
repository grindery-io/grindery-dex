import { FormHelperText } from '@mui/material';
import React from 'react';
import { Card, CardTitle } from '../../Card';
import { FormControl, Input } from './DexTextInput.style';

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
};

const DexTextInput = (props: Props) => {
  const {
    label,
    value,
    onChange,
    name,
    disabled,
    error,
    placeholder,
    endAdornment,
  } = props;
  return (
    <Card style={{ borderRadius: '12px', marginTop: '20px' }}>
      <CardTitle>{label}</CardTitle>
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
        />
        <FormHelperText error={error && error.type === name && !!error.text}>
          {error && error.type === name && !!error.text ? error.text : ''}
        </FormHelperText>
      </FormControl>
    </Card>
  );
};

export default DexTextInput;
