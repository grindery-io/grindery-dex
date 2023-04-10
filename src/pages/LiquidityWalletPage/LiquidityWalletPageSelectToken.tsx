import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  TokenSearch,
  TokensList,
  NotFound,
  Loading,
  PageCardHeader,
  PageCardBody,
} from '../../components';
import {
  useAppSelector,
  selectChainsItems,
  selectUserId,
  selectWalletsItems,
  selectWalletsLoading,
} from '../../store';
import { ROUTES } from '../../config';
import { getWalletById, getWalletChain } from '../../utils';
import { useWalletsController } from '../../controllers';
import { TokenType } from '../../types';

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
  }, [currentWallet, walletsIsLoading, navigate]);

  return (
    <>
      <PageCardHeader
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
                ).replace(':tokenSymbol', 'any')
              );
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <PageCardBody>
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
                    ).replace(':tokenSymbol', 'any')
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
      </PageCardBody>
    </>
  );
}

export default LiquidityWalletPageSelectToken;
