import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { Loading, SelectChainButton, AlertBox } from '../../components';
import { ROUTES } from '../../config';
import {
  useAppSelector,
  selectUserAccessToken,
  selectUserChainId,
  selectUserId,
  selectWalletsCreateInput,
  selectWalletsError,
  selectWalletsItems,
  selectWalletsLoading,
  selectChainsItems,
  selectSatelliteAbi,
} from '../../store';
import { useUserController, useWalletsController } from '../../controllers';
import { getChainById } from '../../utils';

function LiquidityWalletPageCreate() {
  let navigate = useNavigate();
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserController();
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const loading = useAppSelector(selectWalletsLoading);
  const errorMessage = useAppSelector(selectWalletsError);
  const chains = useAppSelector(selectChainsItems);
  const wallets = useAppSelector(selectWalletsItems);
  const satelliteAbi = useAppSelector(selectSatelliteAbi);
  const input = useAppSelector(selectWalletsCreateInput);
  const { chainId } = input;
  const currentChain = getChainById(chainId, chains);
  const { handleWalletsCreateAction } = useWalletsController();

  return (
    <>
      <DexCardHeader
        title="Create wallet"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(ROUTES.SELL.WALLETS.ROOT.FULL_PATH);
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
            navigate(ROUTES.SELL.WALLETS.SELECT_CHAIN.FULL_PATH);
          }}
          error={errorMessage}
        />

        {loading && <Loading />}

        {errorMessage &&
          errorMessage.type === 'createWallet' &&
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
              ? 'Create wallet'
              : 'Connect wallet'
          }
          onClick={
            user
              ? () => {
                  handleWalletsCreateAction(
                    accessToken,
                    input,
                    wallets,
                    userChainId,
                    satelliteAbi
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

export default LiquidityWalletPageCreate;
