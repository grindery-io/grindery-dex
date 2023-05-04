import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import {
  AlertBox,
  Stake,
  Loading,
  PageCardHeader,
  PageCardBody,
  PageCardSubmitButton,
} from '../../components';
import { StakeType } from '../../types';
import {
  useAppSelector,
  selectChainsItems,
  selectStakesError,
  selectStakesItems,
  selectStakesLoading,
  selectUserId,
} from '../../store';
import { useUserProvider } from '../../providers';
import { ROUTES } from '../../config';
import { getStakeChain } from '../../utils';

function StakingPageRoot() {
  let navigate = useNavigate();
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserProvider();
  const errorMessage = useAppSelector(selectStakesError);
  const chains = useAppSelector(selectChainsItems);
  const stakes = useAppSelector(selectStakesItems);
  const stakesIsLoading = useAppSelector(selectStakesLoading);

  return (
    <>
      <PageCardHeader
        title="Staking"
        endAdornment={
          user && stakes.length > 4 ? (
            <Tooltip title="Stake">
              <IconButton
                size="medium"
                edge="end"
                onClick={() => {
                  navigate(ROUTES.SELL.STAKING.STAKE.FULL_PATH);
                }}
              >
                <AddCircleOutlineIcon sx={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          ) : null
        }
      />
      <PageCardBody>
        {user &&
          stakes.map((stake: StakeType) => {
            const stakeChain = getStakeChain(stake, chains);
            return stakeChain ? (
              <Stake
                key={stake._id}
                stake={stake}
                stakeChain={stakeChain}
                onWithdrawClick={(s: any) => {
                  navigate(
                    ROUTES.SELL.STAKING.WITHDRAW.FULL_PATH.replace(
                      ':stakeId',
                      stake._id
                    )
                  );
                }}
              />
            ) : null;
          })}
        {user && stakesIsLoading && <Loading />}
        {errorMessage &&
          errorMessage.type === 'getStakes' &&
          errorMessage.text && (
            <AlertBox color="error">
              <p>{errorMessage.text}</p>
            </AlertBox>
          )}
        <PageCardSubmitButton
          label={user ? 'Stake' : 'Connect wallet'}
          onClick={
            user
              ? () => {
                  navigate(ROUTES.SELL.STAKING.STAKE.FULL_PATH);
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

export default StakingPageRoot;
