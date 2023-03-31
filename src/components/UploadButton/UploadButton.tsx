import { Box, Button, FormHelperText, Stack, SxProps } from '@mui/material';
import FileBase64 from 'react-file-base64';
import React, { useEffect, useState } from 'react';
import { Card } from '../Card/Card';
import { CardTitle } from '../Card/CardTitle';
import { FormControl } from './UploadButton.style';

type Props = {
  value: string;
  onChange: (image: string) => void;
  label?: string;
  sx?: SxProps;
  helpText?: string;
  error?: { type: string; text: string };
  name: string;
};

const UploadButton = (props: Props) => {
  const { label, helpText, sx, value, onChange, error, name } = props;

  const [icon, setIcon] = useState(value || '');
  const [key, setKey] = useState(0);
  const [filename, setFilename] = useState('');
  const [validation, setValidation] = useState('');

  const onFilesReady = async (file: any) => {
    setValidation('');

    if (file && file.base64) {
      const type = file.type?.split('/') || [];
      if (type[0] === 'image') {
        setFilename(file.name || '');
        setIcon(file.base64);
      } else {
        setIcon('');
        setKey(key + 1);
        setValidation('Only image type is supported');
        setFilename('');
      }
    } else {
      setIcon('');
      setKey(key + 1);
      setFilename('');
    }
  };

  useEffect(() => {
    onChange(icon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icon]);

  return (
    <Card sx={{ borderRadius: '12px', marginTop: '20px', ...(sx || {}) }}>
      <CardTitle>{label}</CardTitle>
      <FormControl fullWidth sx={{ paddingTop: '6px', paddingBottom: '5px' }}>
        <Stack
          sx={{ margin: '8px 16px 12px' }}
          gap="16px"
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          {icon && (
            <img
              src={icon}
              alt=""
              style={{
                width: '64px',
                height: '64px',
                display: 'block',
                borderRadius: '8px',
              }}
            />
          )}
          <Box
            sx={{
              flex: 1,
              overflow: 'hidden',
              '& input': { display: 'none' },
              '& label span': {
                display: 'block',
                cursor: 'pointer',
                border: '1px solid #3f49e1',
                color: '#3f49e1',
                padding: '8px 12px',
                fontSize: '14px',
                textAlign: 'center',
                borderRadius: '8px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition:
                  'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                '&:hover': {
                  border: '1px solid rgb(50,58,180)',
                  color: 'rgb(50,58,180)',
                  backgroundColor: '#f7f8fe',
                },
              },
            }}
          >
            <label>
              <span>{filename || 'Select file'}</span>
              <FileBase64 key={key} multiple={false} onDone={onFilesReady} />
            </label>
          </Box>
        </Stack>
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
        {validation && (
          <FormHelperText error={Boolean(validation)}>
            {validation}
          </FormHelperText>
        )}
      </FormControl>
    </Card>
  );
};

export default UploadButton;
