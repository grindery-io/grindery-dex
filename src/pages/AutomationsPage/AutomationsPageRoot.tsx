import React from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import AlertBox from '../../components/AlertBox/AlertBox';
import DexCardBody from '../../components/DexCard/DexCardBody';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import SelectChainButton from '../../components/SelectChainButton/SelectChainButton';
import TextArea from '../../components/TextArea/TextArea';
import TransactionID from '../../components/TransactionID/TransactionID';
import Loading from '../../components/Loading/Loading';
import TextInput from '../../components/TextInput/TextInput';
import { CardTitle } from '../../components/Card/CardTitle';
import { useAppSelector } from '../../store/storeHooks';
import {
  selectLiquidityWalletAbi,
  selectPoolAbi,
} from '../../store/slices/abiSlice';
import {
  selectUserAccessToken,
  selectUserChainId,
  selectUserId,
} from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';
import { ROUTES } from '../../config/routes';
import {
  selectAutomationsBotAddress,
  selectAutomationsError,
  selectAutomationsInput,
  selectAutomationsLoading,
} from '../../store/slices/automationsSlice';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { ChainType } from '../../types/ChainType';
import { useAutomationsController } from '../../controllers/AutomationsController';
import useLiquidityWallets from '../../hooks/useLiquidityWallets';
import { LiquidityWalletType } from '../../types/LiquidityWalletType';

type Props = {};

const AutomationsPageRoot = (props: Props) => {
  const user = useAppSelector(selectUserId);
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const { connectUser: connect } = useUserController();
  const input = useAppSelector(selectAutomationsInput);
  const { bot, chainId } = input;
  const chains = useAppSelector(selectChainsItems);
  const currentChain = chains.find((c: ChainType) => c.chainId === chainId);
  const errorMessage = useAppSelector(selectAutomationsError);
  const loading = useAppSelector(selectAutomationsLoading);
  const botAddress = useAppSelector(selectAutomationsBotAddress);
  const { handleAutomationsInputChange, handleAutomationsDelegateAction } =
    useAutomationsController();
  const { wallets } = useLiquidityWallets();
  const wallet = wallets.find(
    (w: LiquidityWalletType) => w.chainId === chainId
  );
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
              label="Pool ABI"
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

            <DexCardSubmitButton
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
                        liquidityWalletAbi
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
      </DexCardBody>
    </>
  );
};

export default AutomationsPageRoot;
