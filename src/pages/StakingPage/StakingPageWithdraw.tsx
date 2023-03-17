import React from 'react';
import { IconButton, Button as MuiButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
import { useNavigate } from 'react-router-dom';
import useStakes from '../../hooks/useStakes';
import useStakingPage from '../../hooks/useStakingPage';

function StakingPageWithdraw() {
  const { user, connect } = useGrinderyNexus();
  const {
    VIEWS,
    amountAdd,
    loading,
    errorMessage,
    selectedStake,
    setAmountAdd,
    setErrorMessage,
    setSelectedStake,
    handleWithdrawClick,
  } = useStakingPage();
  let navigate = useNavigate();
  const { stakes } = useStakes();

  return (
    <>
      <DexCardHeader
        title="Withdraw"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              setAmountAdd('');
              setSelectedStake('');
              navigate(VIEWS.ROOT.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />

      <DexCardBody>
        <DexTextInput
          label="GRT Amount"
          value={amountAdd}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setErrorMessage({
              type: '',
              text: '',
            });
            setAmountAdd(event.target.value);
          }}
          name="amountAdd"
          placeholder="Enter amount of tokens"
          disabled={false}
          endAdornment={
            <Box
              sx={{
                '& button': {
                  fontSize: '14px',
                  padding: '4px 8px 5px',
                  display: 'inline-block',
                  width: 'auto',
                  margin: '0 16px 0 0',
                  background: 'rgba(63, 73, 225, 0.08)',
                  color: 'rgb(63, 73, 225)',
                  borderRadius: '8px',
                  minWidth: 0,
                  '&:hover': {
                    background: 'rgba(63, 73, 225, 0.12)',
                    color: 'rgb(63, 73, 225)',
                  },
                },
              }}
            >
              <MuiButton
                disableElevation
                size="small"
                variant="contained"
                onClick={() => {
                  setAmountAdd(
                    stakes.find((s) => s._id === selectedStake)?.amount || '0'
                  );
                }}
              >
                max
              </MuiButton>
            </Box>
          }
          error={errorMessage}
        />

        {loading && <DexLoading />}
        <DexCardSubmitButton
          disabled={loading}
          label={
            loading
              ? 'Waiting transaction'
              : user
              ? 'Withdraw'
              : 'Connect wallet'
          }
          onClick={
            user
              ? handleWithdrawClick
              : () => {
                  connect();
                }
          }
        />
      </DexCardBody>
    </>
  );
}

export default StakingPageWithdraw;
