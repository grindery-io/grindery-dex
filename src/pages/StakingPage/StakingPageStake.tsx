import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  AlertBox,
  SelectChainButton,
  TextInput,
  Loading,
  PageCardHeader,
  PageCardBody,
  PageCardSubmitButton,
} from '../../components';
import {
  useAppSelector,
  selectAbiStore,
  selectChainsStore,
  selectStakesStore,
  selectUserStore,
} from '../../store';
import { useUserProvider, useStakesProvider } from '../../providers';
import { ROUTES } from '../../config';
import { ChainType } from '../../types';

function StakingPageStake() {
  let navigate = useNavigate();
  const { id: user, chainId: userChain } = useAppSelector(selectUserStore);
  const { connectUser: connect } = useUserProvider();
  const {
    error: errorMessage,
    loading,
    approved,
    input: { create },
  } = useAppSelector(selectStakesStore);
  const { amount, chainId } = create;
  const { handleCreateInputChange, handleStakeCreateAction } =
    useStakesProvider();

  const { items: chains } = useAppSelector(selectChainsStore);
  const currentChain = chains.find((c: ChainType) => c.chainId === chainId);
  const { poolAbi, tokenAbi } = useAppSelector(selectAbiStore);

  return (
    <>
      <PageCardHeader
        title="Stake"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              handleCreateInputChange('amount', '');
              navigate(ROUTES.SELL.STAKING.ROOT.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />

      <PageCardBody>
        <SelectChainButton
          title="Blockchain"
          chain={currentChain}
          onClick={() => {
            navigate(ROUTES.SELL.STAKING.SELECT_CHAIN.FULL_PATH);
          }}
          error={errorMessage}
        />

        <TextInput
          label="GRT Amount"
          value={amount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleCreateInputChange('amount', event.target.value);
          }}
          name="amount"
          placeholder="Enter amount of tokens"
          disabled={loading}
          error={errorMessage}
        />
        {approved && (
          <AlertBox color="success">
            <p>
              Tokens have been approved.
              <br />
              You can stake now.
            </p>
          </AlertBox>
        )}
        {loading && <Loading />}
        {errorMessage &&
          errorMessage.type === 'transaction' &&
          errorMessage.text && (
            <AlertBox color="error">
              <p>{errorMessage.text}</p>
            </AlertBox>
          )}

        <PageCardSubmitButton
          disabled={loading}
          label={
            loading
              ? 'Waiting transaction'
              : user
              ? approved
                ? 'Stake'
                : 'Approve'
              : 'Connect wallet'
          }
          onClick={
            user
              ? () => {
                  handleStakeCreateAction(
                    create,
                    userChain,
                    approved,
                    tokenAbi,
                    poolAbi
                  );
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

export default StakingPageStake;
