import React from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import { IconButton } from '@mui/material';
import useBuyPage from '../../hooks/useBuyPage';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexChainsList from '../../components/grindery/DexChainsList/DexChainsList';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { Chain } from '../../types/Chain';

type Props = {};

const BuyPageSelectFromChain = (props: Props) => {
  const { VIEWS, fromChain, handleFromChainChange } = useBuyPage();
  const { chains } = useGrinderyChains();
  let navigate = useNavigate();

  return (
    <DexCard>
      <DexCardHeader
        title="Select chain"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(VIEWS.ROOT.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody>
        <DexChainsList
          chain={fromChain?.value || ''}
          chains={chains.map((chain: Chain) => ({
            ...chain,
          }))}
          onClick={(chain: Chain) => {
            handleFromChainChange(chain);
            navigate(VIEWS.ROOT.fullPath);
          }}
        />
        <Box height="20px" />
      </DexCardBody>
    </DexCard>
  );
};

export default BuyPageSelectFromChain;
