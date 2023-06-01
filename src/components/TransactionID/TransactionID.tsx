import React, { ElementType, useState } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { Stack, SxProps } from '@mui/system';
import { formatAddress } from '../../utils';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

type Props = {
  value: string;
  label?: string;
  link?: string;
  isShort?: boolean;
  startLength?: number;
  endLength?: number;
  showCopyButton?: boolean;
  linkTooltip?: string;
  labelStyle?: SxProps | React.CSSProperties;
  containerStyle?: SxProps | React.CSSProperties;
  valueStyle?: SxProps | React.CSSProperties;
  iconStyle?: SxProps | React.CSSProperties;
  containerComponent?: ElementType<any>;
  buttonStyle?: SxProps | React.CSSProperties;
};

const TransactionID = (props: Props) => {
  const {
    value,
    label,
    link,
    isShort = true,
    startLength = 10,
    endLength = 10,
    showCopyButton = true,
    linkTooltip = 'View on blockchain explorer',
    labelStyle,
    containerStyle,
    valueStyle,
    iconStyle,
    containerComponent,
    buttonStyle,
  } = props;
  const [copied, setCopied] = useState(false);
  return value ? (
    <Stack
      component={containerComponent || 'div'}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      gap="4px"
      sx={containerStyle}
    >
      <Typography
        sx={{
          color: 'rgb(116, 116, 116)',
          fontSize: '14px',
          margin: 0,
          padding: 0,
          ...(labelStyle || {}),
        }}
        component={containerComponent || 'p'}
      >
        {label ? `${label}: ` : ''}
        <Typography
          component="span"
          sx={{ fontSize: 'inherit', color: 'inherit', ...(valueStyle || {}) }}
        >
          {isShort ? formatAddress(value, startLength, endLength) : value}
        </Typography>
      </Typography>
      {showCopyButton || Boolean(link) ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          component={containerComponent || 'div'}
        >
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
                sx={{
                  fontSize: '14px',
                  color: '#3f49e1',
                  ...(buttonStyle || {}),
                }}
                onClick={(event: any) => {
                  event.stopPropagation();
                  navigator.clipboard.writeText(value);
                  setCopied(true);
                }}
              >
                <ContentCopyIcon fontSize="inherit" sx={iconStyle || {}} />
              </IconButton>
            </Tooltip>
          )}

          {Boolean(link) && (
            <Tooltip title={linkTooltip}>
              <IconButton
                size="small"
                sx={{
                  fontSize: '14px',
                  color: '#3f49e1',
                  ...(buttonStyle || {}),
                }}
                onClick={(event: any) => {
                  event.stopPropagation();
                  window.open(link, '_blank');
                }}
              >
                <OpenInNewIcon fontSize="inherit" sx={iconStyle || {}} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ) : null}
    </Stack>
  ) : null;
};

export default TransactionID;
