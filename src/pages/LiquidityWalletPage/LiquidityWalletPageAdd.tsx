import React, { useEffect } from 'react';
import { IconButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
import { useNavigate, useParams } from 'react-router-dom';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import DexSelectTokenButton from '../../components/grindery/DexSelectTokenButton/DexSelectTokenButton';
import { TokenType } from '../../types/TokenType';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { Chain } from '../../types/Chain';
import useLiquidityWallets from '../../hooks/useLiquidityWallets';
import DexAlertBox from '../../components/grindery/DexAlertBox/DexAlertBox';

function LiquidityWalletPageAdd() {
  const { user, connect } = useGrinderyNexus();
  const {
    amountAdd,
    loading,
    errorMessage,
    VIEWS,
    setAmountAdd,
    setErrorMessage,
    handleAddClick,
    token,
    setToken,
  } = useLiquidityWalletPage();
  let navigate = useNavigate();
  const { wallets, isLoading: walletsIsLoading } = useLiquidityWallets();

  const { chains } = useGrinderyChains();
  let { walletId } = useParams();

  const currentWallet = wallets.find(
    (w: LiquidityWallet) => w._id === walletId
  );

  const walletChain = chains.find(
    (c: Chain) => c.value.split(':')[1] === currentWallet?.chainId
  );

  const selectedToken =
    walletChain?.tokens?.find((t: TokenType) => t.symbol === token) || '';

  useEffect(() => {
    if (!currentWallet && !walletsIsLoading) {
      navigate(VIEWS.ROOT.fullPath);
    }
  }, [currentWallet, walletsIsLoading]);

  return (
    <>
      <DexCardHeader
        title="Add funds"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              setAmountAdd('');
              setToken('');
              navigate(
                VIEWS.TOKENS.fullPath.replace(':walletId', walletId || '')
              );
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />

      <DexCardBody>
        {user && walletsIsLoading ? (
          <DexLoading />
        ) : (
          <>
            <DexSelectTokenButton
              onClick={() => {
                navigate(
                  VIEWS.SELECT_TOKEN.fullPath.replace(
                    ':walletId',
                    walletId || ''
                  )
                );
              }}
              title="Token"
              token={selectedToken}
              error={errorMessage}
            />
            <DexTextInput
              label="Amount"
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
              error={errorMessage}
            />
            {errorMessage &&
              errorMessage.type === 'tx' &&
              errorMessage.text && (
                <DexAlertBox color="error">
                  <p>{errorMessage.text}</p>
                </DexAlertBox>
              )}
            {loading && <DexLoading />}
            <DexCardSubmitButton
              disabled={loading}
              label={
                loading
                  ? 'Waiting transaction'
                  : user
                  ? 'Add funds'
                  : 'Connect wallet'
              }
              onClick={
                user
                  ? () => {
                      handleAddClick(walletId || '');
                    }
                  : () => {
                      connect();
                    }
              }
            />
          </>
        )}
      </DexCardBody>
    </>
  );
}

export default LiquidityWalletPageAdd;
