import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import ChainsList from '../../components/ChainsList/ChainsList';
import { useNavigate } from 'react-router-dom';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { useAppSelector } from '../../store/storeHooks';
import { selectFaucetInput } from '../../store/slices/faucetSlice';
import { ROUTES } from '../../config/routes';
import { useFaucetController } from '../../controllers/FaucetController';
import {
  selectChainsItems,
  selectChainsLoading,
} from '../../store/slices/chainsSlice';
import { ChainType } from '../../types/ChainType';

function FaucetPageSelectChain() {
  const input = useAppSelector(selectFaucetInput);
  const chain = input.chainId;
  let navigate = useNavigate();
  const { handleInputChange } = useFaucetController();
  const chains = useAppSelector(selectChainsItems);
  const loading = useAppSelector(selectChainsLoading);

  return (
    <>
      <DexCardHeader
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
      <DexCardBody>
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
      </DexCardBody>
    </>
  );
}

export default FaucetPageSelectChain;
