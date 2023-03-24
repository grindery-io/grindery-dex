import React from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import DexCard from '../../components/DexCard/DexCard';
import DexCardBody from '../../components/DexCard/DexCardBody';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import { IconButton } from '@mui/material';
import useBuyPage from '../../hooks/useBuyPage';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ChainsList from '../../components/ChainsList/ChainsList';
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
        <ChainsList
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
