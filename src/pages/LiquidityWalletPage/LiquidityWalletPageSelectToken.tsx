import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import { useNavigate } from 'react-router-dom';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import DexTokenSearch from '../../components/grindery/DexTokenSearch/DexTokenSearch';
import DexTokensList from '../../components/grindery/DexTokensList/DexTokensList';
import DexTokensNotFound from '../../components/grindery/DexTokensNotFound/DexTokensNotFound';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import { Chain } from '../../types/Chain';

function LiquidityWalletPageSelectToken() {
  const {
    chain,
    VIEWS,
    chainTokens,
    setErrorMessage,
    currentChain,
    setToken,
    searchToken,
    setSearchToken,
    wallets,
    selectedWallet,
  } = useLiquidityWalletPage();
  let navigate = useNavigate();

  const { chains } = useGrinderyChains();

  const currentWallet = wallets.find(
    (w: LiquidityWallet) => w.id === selectedWallet
  );

  const walletChain = chains.find(
    (c: Chain) => c.value.split(':')[1] === currentWallet?.chainId
  );

  return (
    <>
      <DexCardHeader
        title="Select token"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(VIEWS.ADD.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <Box pb="20px">
        <DexTokenSearch
          value={searchToken}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchToken(event.target.value);
          }}
        />

        {walletChain && walletChain.tokens && walletChain.tokens.length > 0 ? (
          <DexTokensList
            tokens={walletChain.tokens}
            onClick={(chainToken: any) => {
              setToken(chainToken.symbol || '');
              setSearchToken('');
              setErrorMessage({
                type: '',
                text: '',
              });
              navigate(VIEWS.ADD.fullPath);
            }}
          />
        ) : (
          <DexTokensNotFound
            text={
              !walletChain ? (
                <>Please, select a chain to see a list of tokens.</>
              ) : (
                <>
                  We couldn't find tokens{' '}
                  {walletChain ? `on ${walletChain?.label} chain` : ''}. Please
                  try search again or switch the chain.
                </>
              )
            }
          />
        )}
      </Box>
    </>
  );
}

export default LiquidityWalletPageSelectToken;
