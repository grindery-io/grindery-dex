import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { ChainsList, PageCardBody, PageCardHeader } from '../../components';
import {
  useAppSelector,
  selectFaucetInput,
  selectChainsItems,
  selectChainsLoading,
} from '../../store';
import { ROUTES } from '../../config';
import { useFaucetProvider } from '../../providers';
import { ChainType } from '../../types';

function FaucetPageSelectChain() {
  const input = useAppSelector(selectFaucetInput);
  const chain = input.chainId;
  let navigate = useNavigate();
  const { handleInputChange } = useFaucetProvider();
  const chains = useAppSelector(selectChainsItems);
  const loading = useAppSelector(selectChainsLoading);

  return (
    <>
      <PageCardHeader
        title="Select blockchain"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(ROUTES.FAUCET.ROOT.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <PageCardBody>
        <ChainsList
          chains={chains}
          chain={chain}
          onClick={(blockchain: ChainType) => {
            handleInputChange('chainId', blockchain.chainId);
            navigate(ROUTES.FAUCET.ROOT.FULL_PATH);
          }}
          loading={loading}
        />
        <Box pb="20px"></Box>
      </PageCardBody>
    </>
  );
}

export default FaucetPageSelectChain;
