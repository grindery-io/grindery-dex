import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import Stake from '../../components/Stake/Stake';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import { StakeType } from '../../types/StakeType';
import AlertBox from '../../components/AlertBox/AlertBox';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import {
  selectStakesError,
  selectStakesItems,
  selectStakesLoading,
} from '../../store/slices/stakesSlice';
import { selectUserId } from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';
import { ROUTES } from '../../config/routes';
import { getStakeChain } from '../../utils/helpers/stakeHelpers';

function StakingPageRoot() {
  let navigate = useNavigate();
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserController();
  const errorMessage = useAppSelector(selectStakesError);
  const chains = useAppSelector(selectChainsItems);
  const stakes = useAppSelector(selectStakesItems);
  const stakesIsLoading = useAppSelector(selectStakesLoading);

  return (
    <>
      <DexCardHeader
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
      <DexCardBody>
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
        <DexCardSubmitButton
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
      </DexCardBody>
    </>
  );
}

export default StakingPageRoot;
