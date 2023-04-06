import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import ChainsList from '../../components/ChainsList/ChainsList';
import { ChainType } from '../../types/ChainType';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import { useNavigate } from 'react-router-dom';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';

function LiquidityWalletPageSelectChain() {
  const { chain, wallets, VIEWS, setChain } = useLiquidityWalletPage();
  let navigate = useNavigate();

  const chains = useAppSelector(selectChainsItems);

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
              navigate(VIEWS.CREATE.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody>
        <ChainsList
          chain={chain}
          chains={chains.filter(
            (chain: ChainType) =>
              !wallets
                .map((wallet: LiquidityWallet) => wallet.chainId)
                .includes(chain.chainId)
          )}
          onClick={(blockchain: any) => {
            setChain(blockchain.value);
            navigate(VIEWS.CREATE.fullPath);
          }}
        />
        <Box height="20px" />
      </DexCardBody>
    </>
  );
}

export default LiquidityWalletPageSelectChain;
