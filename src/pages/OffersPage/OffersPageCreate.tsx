import React from 'react';
import { IconButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexSelectChainAndTokenButton from '../../components/grindery/DexSelectChainAndTokenButton/DexSelectChainAndTokenButton';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import { useNavigate } from 'react-router-dom';
import DexAlertBox from '../../components/grindery/DexAlertBox/DexAlertBox';
import useOffersPage from '../../hooks/useOffersPage';

function OffersPageCreate() {
  const { user, connect } = useGrinderyNexus();
  const {
    amountMin,
    amountMax,
    loading,
    errorMessage,
    token,
    currentChain,
    setAmountMin,
    setAmountMax,
    setErrorMessage,
    handleCreateClick,
    VIEWS,
  } = useOffersPage();
  let navigate = useNavigate();

  return (
    <>
      <DexCardHeader
        title="Create offer"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              setAmountMin('');
              setAmountMax('');
              navigate(VIEWS.ROOT.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />

      <DexCardBody>
        <DexSelectChainAndTokenButton
          onClick={() => {
            navigate(VIEWS.SELECT_CHAIN.fullPath);
          }}
          title="Blockchain and token"
          chain={currentChain}
          token={token}
          error={errorMessage}
        />

        <Box display="flex" flexDirection="row" gap="16px">
          <DexTextInput
            label="Minimum amount"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setErrorMessage({
                type: '',
                text: '',
              });
              setAmountMin(event.target.value);
            }}
            name="amountMin"
            placeholder="0"
            disabled={false}
            value={amountMin}
            error={errorMessage}
          />
          <DexTextInput
            label="Maximum amount"
            value={amountMax}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setErrorMessage({
                type: '',
                text: '',
              });
              setAmountMax(event.target.value);
            }}
            name="amountMax"
            placeholder="0"
            disabled={false}
            error={errorMessage}
          />
        </Box>
        {errorMessage &&
          errorMessage.type === 'saveOffer' &&
          errorMessage.text && (
            <DexAlertBox color="error">
              <p>{errorMessage.text}</p>
            </DexAlertBox>
          )}
        {loading && <DexLoading />}
        <DexCardSubmitButton
          label={loading ? 'Loading' : user ? 'Create' : 'Connect wallet'}
          onClick={
            user
              ? handleCreateClick
              : () => {
                  connect();
                }
          }
          disabled={loading}
        />
      </DexCardBody>
    </>
  );
}

export default OffersPageCreate;
