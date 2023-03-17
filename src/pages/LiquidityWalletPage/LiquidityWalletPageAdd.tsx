import React from 'react';
import { IconButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
import { useNavigate } from 'react-router-dom';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import DexSelectTokenButton from '../../components/grindery/DexSelectTokenButton/DexSelectTokenButton';
import { TokenType } from '../../types/TokenType';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { Chain } from '../../types/Chain';

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
    wallets,
    selectedWallet,
    setToken,
  } = useLiquidityWalletPage();
  let navigate = useNavigate();

  const { chains } = useGrinderyChains();

  const currentWallet = wallets.find(
    (w: LiquidityWallet) => w.id === selectedWallet
  );

  const walletChain = chains.find(
    (c: Chain) => c.value === currentWallet?.chain
  );

  const selectedToken =
    walletChain?.tokens?.find((t: TokenType) => t.symbol === token) || '';

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
              navigate(VIEWS.TOKENS.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />

      <DexCardBody>
        <DexSelectTokenButton
          onClick={() => {
            navigate(VIEWS.SELECT_TOKEN.fullPath);
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
              ? handleAddClick
              : () => {
                  connect();
                }
          }
        />
      </DexCardBody>
    </>
  );
}

export default LiquidityWalletPageAdd;
