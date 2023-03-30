import React from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useGrinderyNexus } from 'use-grindery-nexus';
import AlertBox from '../../components/AlertBox/AlertBox';
import DexCardBody from '../../components/DexCard/DexCardBody';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import SelectChainButton from '../../components/SelectChainButton/SelectChainButton';
import TextArea from '../../components/TextArea/TextArea';
import TransactionID from '../../components/TransactionID/TransactionID';
import useAbi from '../../hooks/useAbi';
import useAutomationsPage from '../../hooks/useAutomationsPage';
import Loading from '../../components/Loading/Loading';

type Props = {};

const AutomationsPageRoot = (props: Props) => {
  const { user, connect } = useGrinderyNexus();
  const { chain, VIEWS, bot, loading, handleDelegateClick, errorMessage } =
    useAutomationsPage();
  const { liquidityWalletAbi, poolAbi } = useAbi();
  let navigate = useNavigate();

  return (
    <>
      <DexCardHeader title="Trading Automation" />
      <DexCardBody maxHeight="540px">
        <SelectChainButton
          title="Blockchain"
          onClick={() => {
            navigate(VIEWS.SELECT_CHAIN.fullPath);
          }}
          chain={chain}
          error={{
            type: '',
            text: '',
          }}
        />
        <TextArea
          label="Liquidity wallet ABI"
          name="liquidityWalletABI"
          value={JSON.stringify(liquidityWalletAbi)}
          showCopyButton
          readOnly
          maxRows={3}
        />
        <TextArea
          label="Pool ABI"
          name="poolAbi"
          value={JSON.stringify(poolAbi)}
          showCopyButton
          readOnly
          maxRows={3}
        />

        {user && bot && (
          <AlertBox wrapperStyle={{ marginBottom: '20px' }}>
            <Box sx={{ textAlign: 'center' }}></Box>
            <Typography variant="subtitle2" sx={{ marginbottom: '4px' }}>
              Bot address has been added.
            </Typography>
            <TransactionID label="Address" value={bot} />
          </AlertBox>
        )}
        {errorMessage &&
          errorMessage.type === 'setBot' &&
          errorMessage.text && (
            <AlertBox color="error">
              <p>{errorMessage.text}</p>
            </AlertBox>
          )}
        {loading && <Loading />}
        {!bot && (
          <DexCardSubmitButton
            loading={loading}
            label={user ? 'Delegate power to Zapier' : 'Connect wallet'}
            onClick={
              user
                ? () => {
                    handleDelegateClick();
                  }
                : () => {
                    connect();
                  }
            }
            disabled={loading}
          />
        )}
      </DexCardBody>
    </>
  );
};

export default AutomationsPageRoot;
