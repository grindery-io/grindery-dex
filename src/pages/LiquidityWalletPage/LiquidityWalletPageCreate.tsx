import React from 'react';
import { IconButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexSelectChainButton from '../../components/grindery/DexSelectChainButton/DexSelectChainButton';
import { useNavigate } from 'react-router-dom';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import DexAlertBox from '../../components/grindery/DexAlertBox/DexAlertBox';

function LiquidityWalletPageCreate() {
  const { user, connect } = useGrinderyNexus();
  const {
    loading,
    errorMessage,
    currentChain,
    VIEWS,
    setAmountAdd,
    setErrorMessage,
    handleCreateClick,
  } = useLiquidityWalletPage();
  let navigate = useNavigate();

  return (
    <>
      <DexCardHeader
        title="Create wallet"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              setAmountAdd('');
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
            setErrorMessage({
              type: '',
              text: '',
            });
            navigate(VIEWS.SELECT_CHAIN.fullPath);
          }}
          error={errorMessage}
        />

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
              ? 'Create wallet'
              : 'Connect wallet'
          }
          onClick={
            user
              ? handleCreateClick
              : () => {
                  connect();
                }
          }
        />
      </DexCardBody>
    </>
  );
}

export default LiquidityWalletPageCreate;
