import {
  FormHelperText,
  IconButton,
  Stack,
  SxProps,
  Tooltip,
} from '@mui/material';
import React, { useState } from 'react';
import { Card } from '../Card/Card';
import { CardTitle } from '../Card/CardTitle';
import { FormControl, Input } from './TextArea.style';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type Props = {
  label: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  showCopyButton?: boolean;
  readOnly?: boolean;
  maxRows?: number;
};

const TextArea = (props: Props) => {
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
    showCopyButton,
    readOnly,
    maxRows,
  } = props;
  const [copied, setCopied] = useState(false);
  return (
    <Card sx={{ borderRadius: '12px', marginTop: '20px', ...(sx || {}) }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CardTitle>{label}</CardTitle>
        {showCopyButton && (
          <Tooltip
            title={copied ? 'Copied' : 'Copy to clipboard'}
            onClose={() => {
              setTimeout(() => {
                setCopied(false);
              }, 300);
            }}
          >
            <IconButton
              size="small"
              sx={{ margin: '14px 8px 0', fontSize: '16px', color: '#3f49e1' }}
              onClick={(event: any) => {
                navigator.clipboard.writeText(value);
                setCopied(true);
              }}
            >
              <ContentCopyIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <FormControl fullWidth sx={{ paddingTop: '6px', paddingBottom: '5px' }}>
        <Input
          size="small"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          value={value}
          onChange={Boolean(onChange) ? onChange : () => {}}
          name={name}
          placeholder={placeholder || ''}
          disabled={disabled}
          style={{ padding: `0px ${endAdornment ? '0px' : '16px'} 0px 0` }}
          endAdornment={endAdornment}
          multiline
          maxRows={maxRows || 4}
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

export default TextArea;
