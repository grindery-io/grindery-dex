import React, { useEffect } from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import { useNavigate, useParams } from 'react-router-dom';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import TokenSearch from '../../components/TokenSearch/TokenSearch';
import TokensList from '../../components/TokensList/TokensList';
import NotFound from '../../components/NotFound/NotFound';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import { Chain } from '../../types/Chain';
import useLiquidityWallets from '../../hooks/useLiquidityWallets';
import Loading from '../../components/Loading/Loading';
import { useGrinderyNexus } from 'use-grindery-nexus';
import DexCardBody from '../../components/DexCard/DexCardBody';

function LiquidityWalletPageSelectToken() {
  const { user } = useGrinderyNexus();
  const { VIEWS, setErrorMessage, setToken, searchToken, setSearchToken } =
    useLiquidityWalletPage();
  let navigate = useNavigate();
  const { wallets, isLoading: walletsIsLoading } = useLiquidityWallets();
  let { walletId } = useParams();

  const { chains } = useGrinderyChains();

  const currentWallet = wallets.find(
    (w: LiquidityWallet) => w._id === walletId
  );

  const walletChain = chains.find(
    (c: Chain) => c.chainId === currentWallet?.chainId
  );

  useEffect(() => {
    if (!currentWallet && !walletsIsLoading) {
      navigate(VIEWS.ROOT.fullPath);
    }
  }, [currentWallet, walletsIsLoading]);

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
              navigate(VIEWS.ADD.fullPath.replace(':walletId', walletId || ''));
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
            <TokenSearch
              value={searchToken}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchToken(event.target.value);
              }}
            />

            {walletChain &&
            walletChain.tokens &&
            walletChain.tokens.length > 0 ? (
              <TokensList
                tokens={walletChain.tokens}
                onClick={(chainToken: any) => {
                  setToken(chainToken.symbol || '');
                  setSearchToken('');
                  setErrorMessage({
                    type: '',
                    text: '',
                  });
                  navigate(
                    VIEWS.ADD.fullPath.replace(':walletId', walletId || '')
                  );
                }}
                chainLabel={walletChain.label}
              />
            ) : (
              <NotFound
                text={
                  !walletChain ? (
                    <>Please, select a chain to see a list of tokens.</>
                  ) : (
                    <>
                      We couldn't find tokens{' '}
                      {walletChain ? `on ${walletChain?.label} chain` : ''}.
                      Please try search again or switch the chain.
                    </>
                  )
                }
              />
            )}
          </>
        )}
      </DexCardBody>
    </>
  );
}

export default LiquidityWalletPageSelectToken;
