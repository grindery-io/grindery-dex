import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton, Button as MuiButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  TextInput,
  Loading,
  PageCardHeader,
  PageCardBody,
  PageCardSubmitButton,
} from '../../components';
import { StakeType } from '../../types';
import {
  useAppSelector,
  selectAbiStore,
  selectStakesStore,
  selectUserStore,
} from '../../store';
import { useUserProvider, useStakesProvider } from '../../providers';
import { ROUTES } from '../../config';

function StakingPageWithdraw() {
  const { id: user, chainId: userChainId } = useAppSelector(selectUserStore);
  const { connectUser: connect } = useUserProvider();
  const {
    items: stakes,
    error: errorMessage,
    loading,
    input: { withdraw },
  } = useAppSelector(selectStakesStore);
  const { amount } = withdraw;
  const { poolAbi } = useAppSelector(selectAbiStore);
  let navigate = useNavigate();

  const { handleWithdrawInputChange, handleStakeWithdrawAction } =
    useStakesProvider();
  let { stakeId } = useParams();
  const currentStake = stakes.find((s: StakeType) => s._id === stakeId);

  useEffect(() => {
    if (!currentStake && !loading) {
      navigate(ROUTES.SELL.STAKING.ROOT.FULL_PATH);
    }
  }, [currentStake, loading, navigate]);

  return (
    <>
      <PageCardHeader
        title="Withdraw"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              handleWithdrawInputChange('amount', '');
              navigate(ROUTES.SELL.STAKING.ROOT.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />

      <PageCardBody>
        {user && (
          <TextInput
            label="GRT Amount"
            value={amount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleWithdrawInputChange('amount', event.target.value);
            }}
            name="amount"
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
                    handleWithdrawInputChange(
                      'amount',
                      stakes.find((s) => s._id === currentStake?._id)?.amount ||
                        '0'
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
        <PageCardSubmitButton
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
              ? () => {
                  if (currentStake) {
                    handleStakeWithdrawAction(
                      withdraw,
                      currentStake,
                      userChainId,
                      poolAbi
                    );
                  }
                }
              : () => {
                  connect();
                }
          }
        />
      </PageCardBody>
    </>
  );
}

export default StakingPageWithdraw;
