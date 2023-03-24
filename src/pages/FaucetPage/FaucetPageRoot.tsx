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

function FaucetPageRoot() {
  const { user, connect, chain } = useGrinderyNexus();
  const {
    VIEWS,
    userAddress,
    amountGRT,
    loading,
    trxHash,
    error,
    errorMessage,
    currentChain,
    setUserAddress,
    setAmountGRT,
    setErrorMessage,
    handleGetClick,
  } = useFaucetPage();
  let navigate = useNavigate();

  return (
    <>
      <DexCardHeader title="Get GRT Tokens" />

      <DexCardBody>
        <SelectChainButton
          title="Blockchain"
          onClick={() => {
            navigate(VIEWS.SELECT_CHAIN.fullPath);
          }}
          chain={currentChain}
        />

        <TextInput
          label="Wallet address"
          value={userAddress || ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setErrorMessage({
              type: '',
              text: '',
            });
            setUserAddress(event.target.value);
          }}
          name="userAddress"
          placeholder="0x"
          disabled={false}
          error={errorMessage}
        />

        <TextInput
          label="Amount"
          value={amountGRT}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setErrorMessage({
              type: '',
              text: '',
            });
            setAmountGRT(event.target.value);
          }}
          name="amountGRT"
          placeholder="Enter amount of tokens"
          disabled={false}
          error={errorMessage}
        />

        {loading && <Loading />}

        {trxHash && (
          <AlertBox color={error ? 'error' : 'success'}>
            <p>Transaction {error ? 'failed' : 'success'}.</p>
            <p>
              <a
                href={`${TX_EXPLORER[chain || '']}${trxHash}`}
                target="_blank"
                rel="noreferrer"
              >
                {trxHash.substring(0, 6) +
                  '...' +
                  trxHash.substring(trxHash.length - 4)}
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
              ? handleGetClick
              : () => {
                  connect();
                }
          }
        />
      </DexCardBody>
    </>
  );
}

export default FaucetPageRoot;
