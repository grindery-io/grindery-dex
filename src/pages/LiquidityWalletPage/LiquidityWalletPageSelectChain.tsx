import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexChainsList from '../../components/grindery/DexChainsList/DexChainsList';
import { Chain } from '../../types/Chain';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import { useNavigate } from 'react-router-dom';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';

function LiquidityWalletPageSelectChain() {
  const { chain, wallets, VIEWS, setChain } = useLiquidityWalletPage();
  let navigate = useNavigate();

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
              navigate(VIEWS.CREATE.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody>
        <DexChainsList
          chain={chain}
          chains={chains.filter(
            (chain: Chain) =>
              !wallets
                .map((wallet: LiquidityWallet) => wallet.chainId)
                .includes(chain.value.split(':')[1])
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
