import React, { useEffect } from 'react';
import { IconButton, Button as MuiButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import TextInput from '../../components/TextInput/TextInput';
import { useNavigate, useParams } from 'react-router-dom';
import useStakingPage from '../../hooks/useStakingPage';
import { StakeType } from '../../types/StakeType';
import { useAppSelector } from '../../store/storeHooks';
import {
  selectStakesItems,
  selectStakesLoading,
} from '../../store/slices/stakesSlice';
import { selectUserId } from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';

function StakingPageWithdraw() {
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserController();
  const {
    VIEWS,
    amountAdd,
    loading,
    errorMessage,
    selectedStake,
    setChain,
    setAmountAdd,
    setErrorMessage,
    setSelectedStake,
    handleWithdrawClick,
  } = useStakingPage();
  let navigate = useNavigate();
  const stakes = useAppSelector(selectStakesItems);
  const stakesIsLoading = useAppSelector(selectStakesLoading);
  let { stakeId } = useParams();
  const currentStake = stakes.find((s: StakeType) => s._id === stakeId);

  useEffect(() => {
    if (currentStake) {
      setChain(`eip155:${currentStake.chainId}`);
    }
  }, [currentStake]);

  useEffect(() => {
    if (!currentStake && !stakesIsLoading) {
      navigate(VIEWS.ROOT.fullPath);
    }
  }, [currentStake, stakesIsLoading]);

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
        {user && stakesIsLoading ? (
          <Loading />
        ) : (
          <TextInput
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
        )}

        {loading && <Loading />}
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
