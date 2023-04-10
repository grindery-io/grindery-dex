import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import { useNavigate, useParams } from 'react-router-dom';
import TokenSearch from '../../components/TokenSearch/TokenSearch';
import TokensList from '../../components/TokensList/TokensList';
import NotFound from '../../components/NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { selectUserId } from '../../store/slices/userSlice';
import { ROUTES } from '../../config/routes';
import {
  selectWalletsItems,
  selectWalletsLoading,
} from '../../store/slices/walletsSlice';
import {
  getWalletById,
  getWalletChain,
} from '../../utils/helpers/walletHelpers';
import { useWalletsController } from '../../controllers/WalletsController';
import { TokenType } from '../../types/TokenType';

function LiquidityWalletPageSelectToken() {
  let navigate = useNavigate();
  let { walletId } = useParams();
  const userId = useAppSelector(selectUserId);
  const chains = useAppSelector(selectChainsItems);
  const [searchToken, setSearchToken] = useState('');
  const wallets = useAppSelector(selectWalletsItems);
  const walletsIsLoading = useAppSelector(selectWalletsLoading);
  const currentWallet = getWalletById(walletId || '', wallets);
  const walletChain = currentWallet
    ? getWalletChain(currentWallet, chains)
    : null;
  const { handleWalletsAddtokensInputChange } = useWalletsController();
  const tokens = (walletChain?.tokens || []).filter(
    (t: TokenType) =>
      !searchToken || t.symbol.toLowerCase().includes(searchToken.toLowerCase())
  );

  useEffect(() => {
    if (!currentWallet && !walletsIsLoading) {
      navigate(ROUTES.SELL.WALLETS.ROOT.FULL_PATH);
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
              navigate(
                ROUTES.SELL.WALLETS.ADD.FULL_PATH.replace(
                  ':walletId',
                  walletId || ''
                )
              );
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody>
        {userId && walletsIsLoading ? (
          <>
            <Loading />
            <Box height="20px" />
          </>
        ) : (
          <>
            <TokenSearch
              value={searchToken}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchToken(event.target.value);
              }}
            />

            {tokens && tokens.length > 0 ? (
              <TokensList
                tokens={tokens}
                onClick={(t: TokenType) => {
                  handleWalletsAddtokensInputChange(
                    'tokenId',
                    t.coinmarketcapId || ''
                  );
                  navigate(
                    ROUTES.SELL.WALLETS.ADD.FULL_PATH.replace(
                      ':walletId',
                      walletId || ''
                    )
                  );
                }}
                chainLabel={walletChain?.label || ''}
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
