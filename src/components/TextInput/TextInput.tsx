import { FormHelperText, SxProps } from '@mui/material';
import React from 'react';
import { Card } from '../Card/Card';
import { CardTitle } from '../Card/CardTitle';
import { FormControl, Input } from './TextInput.style';

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
  sx?: SxProps;
  helpText?: string | React.ReactNode;
  readOnly?: boolean;
};

const TextInput = (props: Props) => {
  const {
    label,
    value,
    onChange,
    name,
    disabled,
    error,
    placeholder,
    endAdornment,
    sx,
    helpText,
    readOnly,
  } = props;
  return (
    <Card sx={{ borderRadius: '12px', marginTop: '20px', ...(sx || {}) }}>
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
          readOnly={readOnly}
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
    </Card>
  );
};

export default TextInput;
