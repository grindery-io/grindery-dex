import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { PageCardHeader, PageCardBody, ChainsList } from '../../components';
import { ChainType } from '../../types';
import {
  useAppSelector,
  selectAutomationsStore,
  selectChainsStore,
} from '../../store';
import { ROUTES } from '../../config';
import { useAutomationsProvider } from '../../providers';

type Props = {};

const AutomationsPageSelectChain = (props: Props) => {
  const { items: chains, loading: chainsIsLoading } =
    useAppSelector(selectChainsStore);
  const { handleAutomationsInputChange } = useAutomationsProvider();

  const { input } = useAppSelector(selectAutomationsStore);
  const { chainId } = input;

  let navigate = useNavigate();
  return (
    <>
      <PageCardHeader
        title="Select chain"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(ROUTES.SELL.AUTOMATIONS.ROOT.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <PageCardBody>
        <ChainsList
          chain={chainId}
          chains={chains}
          onClick={(chain: ChainType) => {
            handleAutomationsInputChange('chainId', chain.chainId);
            navigate(ROUTES.SELL.AUTOMATIONS.ROOT.FULL_PATH);
          }}
          loading={chainsIsLoading}
        />
        <Box height="20px" />
      </PageCardBody>
    </>
  );
};

export default AutomationsPageSelectChain;
