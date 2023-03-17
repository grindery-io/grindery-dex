import React from 'react';
import { IconButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
import DexSelectChainButton from '../../components/grindery/DexSelectChainButton/DexSelectChainButton';
import DexAlertBox from '../../components/grindery/DexAlertBox/DexAlertBox';
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
        <DexSelectChainButton
          title="Blockchain"
          chain={currentChain}
          onClick={() => {
            navigate(VIEWS.SELECT_CHAIN.fullPath);
          }}
        />

        <DexTextInput
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
          <DexAlertBox color="success">
            <p>
              Tokens have been approved.
              <br />
              You can stake now.
            </p>
          </DexAlertBox>
        )}
        {loading && <DexLoading />}
        {errorMessage && errorMessage.type === 'tx' && errorMessage.text && (
          <DexAlertBox color="error">
            <p>{errorMessage.text}</p>
          </DexAlertBox>
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
