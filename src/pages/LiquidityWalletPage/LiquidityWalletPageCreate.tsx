import React from 'react';
import { IconButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import SelectChainButton from '../../components/SelectChainButton/SelectChainButton';
import { useNavigate } from 'react-router-dom';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import AlertBox from '../../components/AlertBox/AlertBox';

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
        <SelectChainButton
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
