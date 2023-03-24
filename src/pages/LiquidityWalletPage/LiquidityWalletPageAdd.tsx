import React, { useEffect } from 'react';
import { IconButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import TextInput from '../../components/TextInput/TextInput';
import { useNavigate, useParams } from 'react-router-dom';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import SelectTokenButton from '../../components/SelectTokenButton/SelectTokenButton';
import { TokenType } from '../../types/TokenType';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { Chain } from '../../types/Chain';
import useLiquidityWallets from '../../hooks/useLiquidityWallets';
import AlertBox from '../../components/AlertBox/AlertBox';

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
    (c: Chain) => c.chainId === currentWallet?.chainId
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
          <Loading />
        ) : (
          <>
            <SelectTokenButton
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
            <TextInput
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
                <AlertBox color="error">
                  <p>{errorMessage.text}</p>
                </AlertBox>
              )}
            {loading && <Loading />}
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
