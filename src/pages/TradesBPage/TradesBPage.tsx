import React from 'react';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardBody from '../../components/DexCard/DexCardBody';
import useTrades from '../../hooks/useTrades';
import Loading from '../../components/Loading/Loading';
import Trade from '../../components/Trade/Trade';
import { Trade as TradeType } from '../../types/Trade';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import { Box } from '@mui/system';
import NotFound from '../../components/NotFound/NotFound';
import { useGrinderyNexus } from 'use-grindery-nexus';
import useAbi from '../../hooks/useAbi';
import useLiquidityWallets from '../../hooks/useLiquidityWallets';

function TradesBPage() {
  const { chain: selectedChain, provider, ethers } = useGrinderyNexus();
  const { tradesB: trades, isLoading, completeTrade } = useTrades();
  const { liquidityWalletAbi } = useAbi();
  const { wallets, updateWallet } = useLiquidityWallets();

  const sortedTrades = trades?.sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleTradeCompleteClick = async (trade: TradeType) => {
    if (!trade || !trade.tradeId) {
      console.error('handleTradeCompleteClick error: trade not found');
      return false;
    }
    if (!trade.offerId) {
      console.error('handleTradeCompleteClick error: trade has no offerId');
      return false;
    }
    if (!liquidityWalletAbi) {
      console.error('handleTradeCompleteClick error: abi not found');
      return false;
    }
    if (!wallets || wallets.length < 1) {
      console.error('handleTradeCompleteClick error: user has no wallets');
      return false;
    }

    // get liquidity wallet by chain
    const wallet = wallets.find((w: LiquidityWallet) => w.chainId === '97');

    if (!wallet || !wallet.walletAddress) {
      console.error(
        'handleTradeCompleteClick error: wallet for the chain not found'
      );
      return false;
    }

    if (selectedChain !== 'eip155:97') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: `0x${parseFloat('97').toString(16)}`,
            },
          ],
        });
      } catch (error: any) {
        // handle change switching error
        console.error('handleTradeCompleteClick error: chain switching failed');
        return false;
      }
    }

    // get signer
    const signer = provider.getSigner();

    // set wallet contract
    const _walletContract = new ethers.Contract(
      wallet.walletAddress,
      liquidityWalletAbi,
      signer
    );

    // connect signer
    const walletContract = _walletContract.connect(signer);

    // pay trade transaction
    const tx = await walletContract
      .payOfferWithNativeTokens(
        trade.offerId,
        trade.destAddr,
        ethers.utils.parseEther(parseFloat(trade.amountTokenOffer).toFixed(6))
      )
      .catch((error: any) => {
        console.error('payOfferWithNativeTokens error', error);
        return false;
      });

    // stop execution if trade payment failed
    if (!tx) {
      return false;
    }

    // wait for payment transaction
    try {
      await tx.wait();
    } catch (error: any) {
      console.error('tx.wait error', error);
      return false;
    }

    // update wallet balance
    const isUpdated = await updateWallet({
      walletAddress: wallet.walletAddress,
      chainId: wallet.chainId,
      tokenId: 'BNB',
      amount: (
        parseFloat(wallet.tokens['BNB'] || '0') -
        parseFloat(trade.amountTokenOffer)
      ).toString(),
    });

    if (!isUpdated) {
      console.error(
        "handleTradeCompleteClick error: wallet balance wasn't updated"
      );
    }

    // set trade as completed
    const completed = await completeTrade(trade.tradeId);

    if (!completed) {
      console.error(
        "handleTradeCompleteClick error: trade wasn't marked as completed"
      );
    }

    return true;
  };

  return (
    <>
      <DexCard>
        <DexCardHeader title="Trades" />
        <DexCardBody maxHeight="540px">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {sortedTrades && sortedTrades.length > 0 ? (
                <>
                  {sortedTrades.map((trade: TradeType) => (
                    <Trade
                      key={trade._id}
                      trade={trade}
                      userType="b"
                      onCompleteClick={handleTradeCompleteClick}
                    />
                  ))}
                  <Box height="10px" />
                </>
              ) : (
                <NotFound text="No trades found" />
              )}
            </>
          )}
        </DexCardBody>
      </DexCard>
    </>
  );
}

export default TradesBPage;
