import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import TextInput from '../../components/TextInput/TextInput';
import SelectChainButton from '../../components/SelectChainButton/SelectChainButton';
import AlertBox from '../../components/AlertBox/AlertBox';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/storeHooks';
import { selectUserChainId, selectUserId } from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';
import { ROUTES } from '../../config/routes';
import {
  selectStakesApproved,
  selectStakesCreateInput,
  selectStakesError,
  selectStakesLoading,
} from '../../store/slices/stakesSlice';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { ChainType } from '../../types/ChainType';
import { selectPoolAbi, selectTokenAbi } from '../../store/slices/abiSlice';
import { useStakesController } from '../../controllers/StakesController';

function StakingPageStake() {
  let navigate = useNavigate();
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserController();
  const input = useAppSelector(selectStakesCreateInput);
  const userChain = useAppSelector(selectUserChainId);
  const { amount, chainId } = input;
  const { handleCreateInputChange, handleStakeCreateAction } =
    useStakesController();
  const loading = useAppSelector(selectStakesLoading);
  const errorMessage = useAppSelector(selectStakesError);
  const approved = useAppSelector(selectStakesApproved);
  const chains = useAppSelector(selectChainsItems);
  const currentChain = chains.find((c: ChainType) => c.chainId === chainId);
  const tokenAbi = useAppSelector(selectTokenAbi);
  const poolAib = useAppSelector(selectPoolAbi);

  return (
    <>
      <DexCardHeader
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

      <DexCardBody>
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

        <DexCardSubmitButton
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
                    input,
                    userChain,
                    approved,
                    tokenAbi,
                    poolAib
                  );
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

export default StakingPageStake;
