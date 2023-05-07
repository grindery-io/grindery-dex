import React from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  Loading,
  TransactionID,
  TextArea,
  SelectChainButton,
  AlertBox,
  CardTitle,
  PageCardBody,
  PageCardHeader,
  PageCardSubmitButton,
} from '../../components';
import {
  useAppSelector,
  selectAbiStore,
  selectAutomationsStore,
  selectChainsStore,
  selectWalletsStore,
  selectUserStore,
} from '../../store';
import { useUserProvider, useAutomationsProvider } from '../../providers';
import { ROUTES } from '../../config';
import { ChainType, LiquidityWalletType } from '../../types';

type Props = {};

const AutomationsPageRoot = (props: Props) => {
  const {
    id: user,
    accessToken,
    chainId: userChainId,
  } = useAppSelector(selectUserStore);
  const { connectUser: connect } = useUserProvider();
  const {
    error: errorMessage,
    loading,
    botAddress,
    input,
  } = useAppSelector(selectAutomationsStore);
  const { bot, chainId } = input;
  const { items: chains } = useAppSelector(selectChainsStore);
  const currentChain = chains.find((c: ChainType) => c.chainId === chainId);
  const { handleAutomationsInputChange, handleAutomationsDelegateAction } =
    useAutomationsProvider();
  const { items: wallets } = useAppSelector(selectWalletsStore);
  const wallet = wallets.find(
    (w: LiquidityWalletType) => w.chainId === chainId
  );
  const { poolAbi, liquidityWalletAbi } = useAppSelector(selectAbiStore);
  let navigate = useNavigate();

  return (
    <>
      <PageCardHeader title="Trading Automation" />
      <PageCardBody maxHeight="540px">
        <SelectChainButton
          title="Blockchain"
          onClick={() => {
            navigate(ROUTES.SELL.AUTOMATIONS.SELECT_CHAIN.FULL_PATH);
          }}
          chain={currentChain}
          error={errorMessage}
        />
        {!currentChain && <Box height="20px" />}
        {currentChain && (
          <>
            <TextArea
              label="Liquidity wallet ABI"
              name="liquidityWalletABI"
              value={JSON.stringify(liquidityWalletAbi)}
              showCopyButton
              readOnly
              maxRows={3}
            />
            <TextArea
              label="Source ABI"
              name="poolAbi"
              value={JSON.stringify(poolAbi)}
              showCopyButton
              readOnly
              maxRows={3}
            />
            <CardTitle sx={{ padding: '30px 0 0' }}>Power delegation</CardTitle>
            {user && botAddress && (
              <AlertBox wrapperStyle={{ marginBottom: '20px' }}>
                <Box sx={{ textAlign: 'center' }}></Box>
                <Typography variant="subtitle2" sx={{ marginbottom: '4px' }}>
                  Power has been delegated to the bot
                </Typography>
                <TransactionID label="Address" value={botAddress} />
              </AlertBox>
            )}

            <TextInput
              label="Bot address"
              name="bot"
              value={bot}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleAutomationsInputChange('bot', event.target.value);
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

            <PageCardSubmitButton
              loading={loading}
              label={user ? 'Delegate power' : 'Connect wallet'}
              onClick={
                user
                  ? () => {
                      handleAutomationsDelegateAction(
                        accessToken,
                        input,
                        userChainId,
                        wallet?.walletAddress || '',
                        liquidityWalletAbi,
                        chains
                      );
                    }
                  : () => {
                      connect();
                    }
              }
              disabled={loading}
            />
          </>
        )}
      </PageCardBody>
    </>
  );
};

export default AutomationsPageRoot;
