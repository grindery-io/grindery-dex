import React, { useEffect } from 'react';
import { IconButton, Skeleton, Tooltip } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { LiquidityWalletType } from '../../types/LiquidityWalletType';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import { ChainType } from '../../types/ChainType';
import { TokenType } from '../../types/TokenType';
import LiquidityWalletToken, {
  WalletToken,
} from '../../components/LiquidityWalletToken/LiquidityWalletToken';
import useLiquidityWallets from '../../hooks/useLiquidityWallets';
import Loading from '../../components/Loading/Loading';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';

function LiquidityWalletPageTokens() {
  const { user, connect } = useGrinderyNexus();
  const { VIEWS, setToken, setChain } = useLiquidityWalletPage();
  let navigate = useNavigate();
  let { walletId } = useParams();
  const { wallets, isLoading: walletsIsLoading } = useLiquidityWallets();
  const chains = useAppSelector(selectChainsItems);

  const currentWallet = wallets.find(
    (w: LiquidityWalletType) => w._id === walletId
  );

  const walletChain = chains.find(
    (c: ChainType) => c.chainId === currentWallet?.chainId
  );

  useEffect(() => {
    if (currentWallet) {
      setChain(`eip155:${currentWallet.chainId}`);
    }
  }, [currentWallet]);

  useEffect(() => {
    if (!currentWallet && !walletsIsLoading) {
      navigate(VIEWS.ROOT.fullPath);
    }
  }, [currentWallet, walletsIsLoading]);

  return (
    <>
      <DexCardHeader
        title={
          walletChain?.label ? (
            `${walletChain?.label || ''} chain wallet`
          ) : (
            <Skeleton width="150px" sx={{ margin: '0 auto' }} />
          )
        }
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(VIEWS.ROOT.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={
          user && Object.keys(currentWallet?.tokens || {}).length > 4 ? (
            <Tooltip title="Add tokens">
              <IconButton
                size="medium"
                edge="end"
                onClick={() => {
                  navigate(
                    VIEWS.ADD.fullPath.replace(':walletId', walletId || '')
                  );
                }}
              >
                <AddCircleOutlineIcon sx={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Box width={28} height={40} />
          )
        }
      />
      <DexCardBody>
        <>
          {user && walletsIsLoading && <Loading />}
          {user &&
            Object.keys(currentWallet?.tokens || {}).map((key: string) => {
              const token: WalletToken = {
                label: key,
                icon:
                  walletChain?.tokens?.find((t: TokenType) => t.symbol === key)
                    ?.icon || '',
                amount: currentWallet?.tokens?.[key] || '0',
              };
              return (
                <LiquidityWalletToken
                  key={token.label}
                  token={token}
                  tokenChain={walletChain}
                  onWithdrawClick={(t: WalletToken) => {
                    setToken(t.label);
                    navigate(
                      VIEWS.WITHDRAW.fullPath.replace(
                        ':walletId',
                        walletId || ''
                      )
                    );
                  }}
                  onAddClick={(t: WalletToken) => {
                    setToken(t.label);
                    navigate(
                      VIEWS.ADD.fullPath.replace(':walletId', walletId || '')
                    );
                  }}
                />
              );
            })}

          <DexCardSubmitButton
            label={user ? 'Add tokens' : 'Connect wallet'}
            onClick={
              user
                ? () => {
                    navigate(
                      VIEWS.ADD.fullPath.replace(':walletId', walletId || '')
                    );
                  }
                : () => {
                    connect();
                  }
            }
          />
        </>
      </DexCardBody>
    </>
  );
}

export default LiquidityWalletPageTokens;
