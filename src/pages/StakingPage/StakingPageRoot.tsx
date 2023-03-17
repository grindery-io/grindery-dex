import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexStake from '../../components/grindery/DexStake/DexStake';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import { Stake } from '../../types/Stake';
import DexAlertBox from '../../components/grindery/DexAlertBox/DexAlertBox';
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
          stakes.map((stake: Stake) => {
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
              <DexStake
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
        {user && stakesIsLoading && <DexLoading />}
        {errorMessage &&
          errorMessage.type === 'getStakes' &&
          errorMessage.text && (
            <DexAlertBox color="error">
              <p>{errorMessage.text}</p>
            </DexAlertBox>
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
