import React from 'react';
import { IconButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import TextInput from '../../components/TextInput/TextInput';
import SelectChainButton from '../../components/SelectChainButton/SelectChainButton';
import AlertBox from '../../components/AlertBox/AlertBox';
import { useNavigate } from 'react-router-dom';
import useStakingPage from '../../hooks/useStakingPage';

function StakingPageStake() {
  const { user, connect } = useGrinderyNexus();
  const {
    VIEWS,
    amountGRT,
    loading,
    errorMessage,
    approved,
    currentChain,
    setAmountGRT,
    setErrorMessage,
    handleStakeClick,
  } = useStakingPage();
  let navigate = useNavigate();

  return (
    <>
      <DexCardHeader
        title="Stake"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              setAmountGRT('');
              navigate(VIEWS.ROOT.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />

      <DexCardBody>
        <SelectChainButton
          title="Blockchain"
          chain={currentChain}
          onClick={() => {
            navigate(VIEWS.SELECT_CHAIN.fullPath);
          }}
        />

        <TextInput
          label="GRT Amount"
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
          disabled={loading}
          error={errorMessage}
        />
        {approved && (
          <AlertBox color="success">
            <p>
              Tokens have been approved.
              <br />
              You can stake now.
            </p>
          </AlertBox>
        )}
        {loading && <Loading />}
        {errorMessage && errorMessage.type === 'tx' && errorMessage.text && (
          <AlertBox color="error">
            <p>{errorMessage.text}</p>
          </AlertBox>
        )}

        <DexCardSubmitButton
          disabled={loading}
          label={
            loading
              ? 'Waiting transaction'
              : user
              ? approved
                ? 'Stake'
                : 'Approve'
              : 'Connect wallet'
          }
          onClick={
            user
              ? handleStakeClick
              : () => {
                  connect();
                }
          }
        />
      </DexCardBody>
    </>
  );
}

export default StakingPageStake;
