import React from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import AlertBox from '../../components/grindery/AlertBox';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexSelectChainButton from '../../components/grindery/DexSelectChainButton/DexSelectChainButton';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
import { useNavigate } from 'react-router-dom';
import useFaucetPage from '../../hooks/useFaucetPage';
import DexAlertBox from '../../components/grindery/DexAlertBox/DexAlertBox';
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
        <DexSelectChainButton
          title="Blockchain"
          onClick={() => {
            navigate(VIEWS.SELECT_CHAIN.fullPath);
          }}
          chain={currentChain}
        />

        <DexTextInput
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

        <DexTextInput
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

        {loading && <DexLoading />}

        {trxHash && (
          <DexAlertBox color={error ? 'error' : 'success'}>
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
          </DexAlertBox>
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
