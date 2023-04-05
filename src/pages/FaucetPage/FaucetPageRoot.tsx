import React from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import SelectChainButton from '../../components/SelectChainButton/SelectChainButton';
import TextInput from '../../components/TextInput/TextInput';
import { useNavigate } from 'react-router-dom';
import useFaucetPage from '../../hooks/useFaucetPage';
import AlertBox from '../../components/AlertBox/AlertBox';
import { TX_EXPLORER } from '../../constants';
import { useAppSelector } from '../../store/storeHooks';
import { selectUserChainId, selectUserId } from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';
import { ROUTES } from '../../config/routes';
import {
  selectFaucetError,
  selectFaucetInput,
  selectFaucetLoading,
  selectFaucetTransactionId,
} from '../../store/slices/faucetSlice';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { Chain } from '../../types/Chain';
import { useFaucetController } from '../../controllers/FaucetController';
import useAbi from '../../hooks/useAbi';

function FaucetPageRoot() {
  const user = useAppSelector(selectUserId);
  const chain = useAppSelector(selectUserChainId);
  const { connectUser } = useUserController();
  const input = useAppSelector(selectFaucetInput);
  const error = useAppSelector(selectFaucetError);
  const loading = useAppSelector(selectFaucetLoading);
  const transactionId = useAppSelector(selectFaucetTransactionId);
  let navigate = useNavigate();
  const { chains } = useGrinderyChains();
  const currentChain = chains.find((c: Chain) => c.chainId === input.chainId);
  const { handleInputChange, handleGetTokensAction } = useFaucetController();
  const { tokenAbi } = useAbi();

  return (
    <>
      <DexCardHeader title="Get GRT Tokens" />

      <DexCardBody>
        <SelectChainButton
          title="Blockchain"
          onClick={() => {
            navigate(ROUTES.FAUCET.SELECT_CHAIN.FULL_PATH);
          }}
          chain={currentChain}
        />

        <TextInput
          label="Wallet address"
          value={input.address}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleInputChange('address', event.target.value);
          }}
          name="address"
          placeholder="0x"
          disabled={false}
          error={error}
        />

        <TextInput
          label="Amount"
          value={input.amount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleInputChange('amount', event.target.value);
          }}
          name="amount"
          placeholder="Enter amount of tokens"
          disabled={false}
          error={error}
        />

        {loading && <Loading />}

        {transactionId && (
          <AlertBox
            color={error && error.type === 'transaction' ? 'error' : 'success'}
          >
            <p>
              Transaction{' '}
              {error && error.type === 'transaction' ? 'failed' : 'success'}.
            </p>
            <p>
              <a
                href={`${
                  TX_EXPLORER[`eip155:${input.chainId}`]
                }${transactionId}`}
                target="_blank"
                rel="noreferrer"
              >
                {transactionId.substring(0, 6) +
                  '...' +
                  transactionId.substring(transactionId.length - 4)}
              </a>
            </p>
          </AlertBox>
        )}

        <DexCardSubmitButton
          disabled={loading}
          label={
            loading
              ? 'Waiting transaction'
              : user
              ? 'Get GRT'
              : 'Connect wallet'
          }
          onClick={
            user
              ? () => {
                  handleGetTokensAction(input, chain, tokenAbi);
                }
              : () => {
                  connectUser();
                }
          }
        />
      </DexCardBody>
    </>
  );
}

export default FaucetPageRoot;
