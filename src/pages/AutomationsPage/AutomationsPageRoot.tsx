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
import useAutomationsPage from '../../hooks/useAutomationsPage';
import Loading from '../../components/Loading/Loading';
import TextInput from '../../components/TextInput/TextInput';
import { CardTitle } from '../../components/Card/CardTitle';
import { useAppSelector } from '../../store/storeHooks';
import {
  selectLiquidityWalletAbi,
  selectPoolAbi,
} from '../../store/slices/abiSlice';

type Props = {};

const AutomationsPageRoot = (props: Props) => {
  const { user, connect } = useGrinderyNexus();
  const {
    chain,
    VIEWS,
    bot,
    loading,
    errorMessage,
    currentBot,
    handleDelegateClick,
    handleBotChange,
  } = useAutomationsPage();
  const liquidityWalletAbi = useAppSelector(selectLiquidityWalletAbi);
  const poolAbi = useAppSelector(selectPoolAbi);
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
        <CardTitle sx={{ padding: '30px 0 0' }}>Power delegation</CardTitle>
        {user && currentBot && (
          <AlertBox wrapperStyle={{ marginBottom: '20px' }}>
            <Box sx={{ textAlign: 'center' }}></Box>
            <Typography variant="subtitle2" sx={{ marginbottom: '4px' }}>
              Power has been delegated to the bot
            </Typography>
            <TransactionID label="Address" value={currentBot} />
          </AlertBox>
        )}

        <TextInput
          label="Bot address"
          name="bot"
          value={bot}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleBotChange(event.target.value);
          }}
          helpText="Change this if you want to delegate power to&nbsp;a&nbsp;different address."
          error={errorMessage}
        />

        {errorMessage &&
          errorMessage.type === 'setBot' &&
          errorMessage.text && (
            <AlertBox color="error">
              <p>{errorMessage.text}</p>
            </AlertBox>
          )}
        {loading && <Loading />}

        <DexCardSubmitButton
          loading={loading}
          label={user ? 'Delegate power' : 'Connect wallet'}
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
      </DexCardBody>
    </>
  );
};

export default AutomationsPageRoot;
