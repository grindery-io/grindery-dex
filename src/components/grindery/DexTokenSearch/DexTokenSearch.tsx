import React from 'react';
import { Box, InputAdornment } from '@mui/material';
import { Card } from '../../Card';
import { FormControl, Input } from './DexTokenSearch.style';
import { Search as SearchIcon } from '@mui/icons-material';

type Props = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const DexTokenSearch = (props: Props) => {
  const { value, onChange } = props;
  return (
    <Box mt={2} pl="24px" pr="24px">
      <Card style={{ borderRadius: '12px' }}>
        <FormControl
          fullWidth
          style={{
            boxSizing: 'border-box',
            padding: '8px 16px 8px 0',
          }}
        >
          <Input
            size="small"
            placeholder={'Search your token'}
            value={value}
            onChange={onChange}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
            inputProps={{
              inputMode: 'search',
            }}
            autoComplete="off"
          />
        </FormControl>
      </Card>
    </Box>
  );
};

export default DexTokenSearch;
