import React from 'react';
import { useNavigate } from 'react-router-dom';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardBody from '../../components/DexCard/DexCardBody';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import {
  Loading,
  SelectChainButton,
  TextInput,
  AlertBox,
} from '../../components';
import {
  useAppSelector,
  selectUserChainId,
  selectUserId,
  selectFaucetError,
  selectFaucetInput,
  selectFaucetLoading,
  selectFaucetTransactionId,
  selectChainsItems,
  selectTokenAbi,
} from '../../store';
import { useUserController, useFaucetController } from '../../controllers';
import { ROUTES, TX_EXPLORER } from '../../config';
import { ChainType } from '../../types';

function FaucetPageRoot() {
  const user = useAppSelector(selectUserId);
  const chain = useAppSelector(selectUserChainId);
  const { connectUser } = useUserController();
  const input = useAppSelector(selectFaucetInput);
  const error = useAppSelector(selectFaucetError);
  const loading = useAppSelector(selectFaucetLoading);
  const transactionId = useAppSelector(selectFaucetTransactionId);
  let navigate = useNavigate();
  const chains = useAppSelector(selectChainsItems);
  const currentChain = chains.find(
    (c: ChainType) => c.chainId === input.chainId
  );
  const { handleInputChange, handleGetTokensAction } = useFaucetController();
  const tokenAbi = useAppSelector(selectTokenAbi);

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

        {error && error.type === 'transaction' && error.text && (
          <AlertBox color="error">
            <p>{error.text}.</p>
          </AlertBox>
        )}

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
