import React from 'react';
import { Stack } from '@mui/material';
import FilterDropdown from '../FilterDropdown/FilterDropdown';
import { Shopfilter } from '../../store';

type Props = {
  filter: Shopfilter;
  onChange: (filter: Shopfilter) => void;
  filterOptions: {
    value: string;
    label: string;
    chainId?: string;
    tokenId?: string;
  }[];
};

const ShopFilters = (props: Props) => {
  const { filter, filterOptions, onChange } = props;
  const { exchangeToken, exchangeChainId, token, chainId } = filter;
  return (
    <Stack
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
      direction="row"
      gap="0px"
      sx={{ width: '100%', maxWidth: '1053px', margin: '0 auto 24px' }}
    >
      <FilterDropdown
        label="Pay with"
        value={
          exchangeToken && exchangeChainId
            ? `${exchangeToken}:${exchangeChainId}`
            : ''
        }
        onChange={(value) => {
          const valueArr = value.split(':');
          onChange({
            ...filter,
            exchangeToken: valueArr[0] || '',
            exchangeChainId: valueArr[1] || '',
          });
        }}
        options={filterOptions}
        defaultOption={{
          label: 'any token',
          value: '',
        }}
      />
      <FilterDropdown
        label="Buy"
        value={token && chainId ? `${token}:${chainId}` : ''}
        onChange={(value) => {
          const valueArr = value.split(':');
          onChange({
            ...filter,
            token: valueArr[0] || '',
            chainId: valueArr[1] || '',
          });
        }}
        options={filterOptions.filter(
          (option) => option.chainId && option.chainId === '97'
        )}
        defaultOption={{
          label: 'any token',
          value: '',
        }}
      />
    </Stack>
  );
};

export default ShopFilters;
