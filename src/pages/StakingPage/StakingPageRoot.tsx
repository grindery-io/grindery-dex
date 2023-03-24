import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import Stake from '../../components/Stake/Stake';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import { Stake as StakeType } from '../../types/Stake';
import AlertBox from '../../components/AlertBox/AlertBox';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { useNavigate } from 'react-router-dom';
import useStakes from '../../hooks/useStakes';
import useStakingPage from '../../hooks/useStakingPage';

function StakingPageRoot() {
  const { user, connect } = useGrinderyNexus();
  const { VIEWS, errorMessage, setSelectedStake } = useStakingPage();
  let navigate = useNavigate();
  const { chains } = useGrinderyChains();
  const { stakes, isLoading: stakesIsLoading } = useStakes();

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
                  navigate(VIEWS.STAKE.fullPath);
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
            const stakeChain = {
              icon: chains.find((c) => c.value === `eip155:${stake.chainId}`)
                ?.icon,
              label: chains.find((c) => c.value === `eip155:${stake.chainId}`)
                ?.label,
              nativeToken: chains.find(
                (c) => c.value === `eip155:${stake.chainId}`
              )?.nativeToken,
            };
            return (
              <Stake
                key={stake._id}
                stake={stake}
                stakeChain={stakeChain}
                onWithdrawClick={(s: any) => {
                  setSelectedStake(stake._id);
                  navigate(
                    VIEWS.WITHDRAW.fullPath.replace(':stakeId', stake._id)
                  );
                }}
              />
            );
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
                  navigate(VIEWS.STAKE.fullPath);
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
