import React, { useState } from 'react';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Order from '../../components/Order/Order';
import { OrderType } from '../../types/Order';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import { Box } from '@mui/system';
import NotFound from '../../components/NotFound/NotFound';
import { useGrinderyNexus } from 'use-grindery-nexus';
import useAbi from '../../hooks/useAbi';
import useLiquidityWallets from '../../hooks/useLiquidityWallets';
import { getErrorMessage } from '../../utils/error';
import OrderSkeleton from '../../components/Order/OrderSkeleton';
import useOrders from '../../hooks/useOrders';
import { chain } from 'lodash';
import { formatAddress } from '../../utils/address';

function OrdersPage() {
  const { chain: selectedChain, provider, ethers } = useGrinderyNexus();
  const { ordersB: orders, isLoading, completeOrder } = useOrders();
  const { liquidityWalletAbi } = useAbi();
  const { wallets, updateWallet, getWalletBalance } = useLiquidityWallets();
  const [error, setError] = useState({ type: '', text: '' });

  const sortedOrders = orders?.sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleOrderCompleteClick = async (order: OrderType) => {
    setError({
      type: '',
      text: '',
    });
    if (!order || !order.orderId) {
      console.error('handleOrderCompleteClick error: order not found');
      return false;
    }
    if (!order.offerId) {
      console.error('handleOrderCompleteClick error: order has no offerId');
      setError({
        type: order.orderId,
        text: 'Order has no associated offer id',
      });
      return false;
    }
    if (!liquidityWalletAbi) {
      console.error('handleOrderCompleteClick error: abi not found');
      setError({
        type: order.orderId,
        text: 'Wallet ABI is not found',
      });
      return false;
    }
    if (!wallets || wallets.length < 1) {
      console.error('handleOrderCompleteClick error: user has no wallets');
      setError({
        type: order.orderId,
        text: 'You have no liquidity wallet',
      });
      return false;
    }

    // get liquidity wallet by chain
    const wallet = wallets.find((w: LiquidityWallet) => w.chainId === '97');

    if (!wallet || !wallet.walletAddress) {
      console.error(
        'handleOrderCompleteClick error: wallet for the chain not found'
      );
      setError({
        type: order.orderId,
        text: 'You have no liquidity wallet for BSC chain',
      });
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
        console.error('handleOrderCompleteClick error: chain switching failed');
        setError({
          type: order.orderId,
          text: 'Blockchain switching failed. Try again, please.',
        });
        return false;
      }
    }

    let balance = await getWalletBalance(
      '0x0',
      wallet.walletAddress,
      selectedChain?.toString().substring(7)
    );

    if (parseFloat(balance) < parseFloat(order.amountTokenOffer)) {
      console.error(
        "handleOrderCompleteClick error: You don't have enough BNB. Fund your liquidity wallet."
      );
      setError({
        type: order.orderId,
        text: "You don't have enough BNB. Fund your liquidity wallet.",
      });
      return false;
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

    // pay order transaction
    const tx = await walletContract
      .payOfferWithNativeTokens(
        order.offerId,
        order.destAddr,
        ethers.utils.parseEther(parseFloat(order.amountTokenOffer).toFixed(6))
      )
      .catch((error: any) => {
        console.error('payOfferWithNativeTokens error', error);
        setError({
          type: order.orderId || '',
          text: getErrorMessage(error) || 'Transaction error',
        });
        return false;
      });

    // stop execution if order payment failed
    if (!tx) {
      return false;
    }

    // wait for payment transaction
    try {
      await tx.wait();
    } catch (error: any) {
      console.error('tx.wait error', error);
      setError({
        type: order.orderId || '',
        text: getErrorMessage(error) || 'Transaction error',
      });
      return false;
    }

    // get liquidity wallet balance
    balance = await getWalletBalance(
      '0x0',
      wallet.walletAddress,
      selectedChain?.toString().substring(7)
    );

    // update wallet balance
    const isUpdated = await updateWallet({
      walletAddress: wallet.walletAddress,
      chainId: wallet.chainId,
      tokenId: 'BNB',
      amount: balance.toString(),
    });

    if (!isUpdated) {
      console.error(
        "handleOrderCompleteClick error: wallet balance wasn't updated"
      );
      setError({
        type: order.orderId || '',
        text: "Server error: wallet balance wasn't updated",
      });
    }

    // set order as completed
    const completed = await completeOrder(order.orderId);

    if (!completed) {
      console.error(
        "handleOrderCompleteClick error: order wasn't marked as completed"
      );
      setError({
        type: order.orderId || '',
        text: "Server error: order wasn't marked as complete",
      });
    }

    return true;
  };

  return (
    <>
      <DexCard>
        <DexCardHeader title="Orders" />
        <DexCardBody maxHeight="540px">
          {isLoading ? (
            <>
              <OrderSkeleton />
              <OrderSkeleton />
            </>
          ) : (
            <>
              {sortedOrders && sortedOrders.length > 0 ? (
                <>
                  {sortedOrders.map((order: OrderType) => (
                    <Order
                      key={order._id}
                      order={order}
                      userType="b"
                      onCompleteClick={handleOrderCompleteClick}
                      error={
                        error.type && error.type === order.orderId && error.text
                          ? error.text
                          : ''
                      }
                    />
                  ))}
                  <Box height="10px" />
                </>
              ) : (
                <NotFound text="No orders found" />
              )}
            </>
          )}
        </DexCardBody>
      </DexCard>
    </>
  );
}

export default OrdersPage;
