import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import ChainsList from '../../components/ChainsList/ChainsList';
import { Chain } from '../../types/Chain';
import { useNavigate } from 'react-router-dom';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { useAppSelector } from '../../store/storeHooks';
import { selectFaucetInput } from '../../store/slices/faucetSlice';
import { ROUTES } from '../../config/routes';
import { useFaucetController } from '../../controllers/FaucetController';

function FaucetPageSelectChain() {
  const input = useAppSelector(selectFaucetInput);
  const chain = input.chainId;
  let navigate = useNavigate();
  const { handleInputChange } = useFaucetController();
  const { chains } = useGrinderyChains();

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
          onClick={(blockchain: Chain) => {
            handleInputChange('chainId', blockchain.chainId);
            navigate(ROUTES.FAUCET.ROOT.FULL_PATH);
          }}
        />
        <Box pb="20px"></Box>
      </DexCardBody>
    </>
  );
}

export default FaucetPageSelectChain;
