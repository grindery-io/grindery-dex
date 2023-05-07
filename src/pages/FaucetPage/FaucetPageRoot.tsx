import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loading,
  SelectChainButton,
  TextInput,
  AlertBox,
  PageCardHeader,
  PageCardBody,
  PageCardSubmitButton,
} from '../../components';
import {
  useAppSelector,
  selectAbiStore,
  selectChainsStore,
  selectFaucetStore,
  selectUserStore,
} from '../../store';
import { useUserProvider, useFaucetProvider } from '../../providers';
import { ROUTES, TX_EXPLORER } from '../../config';
import { ChainType } from '../../types';

function FaucetPageRoot() {
  let navigate = useNavigate();
  const { id: user, chainId: chain } = useAppSelector(selectUserStore);
  const { connectUser } = useUserProvider();
  const { error, input, loading, transactionId } =
    useAppSelector(selectFaucetStore);
  const { items: chains } = useAppSelector(selectChainsStore);
  const currentChain = chains.find(
    (c: ChainType) => c.chainId === input.chainId
  );
  const { handleInputChange, handleGetTokensAction } = useFaucetProvider();
  const { tokenAbi } = useAppSelector(selectAbiStore);

  return (
    <>
      <PageCardHeader title="Get GRT Tokens" />

      <PageCardBody>
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

        <PageCardSubmitButton
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
      </PageCardBody>
    </>
  );
}

export default FaucetPageRoot;
