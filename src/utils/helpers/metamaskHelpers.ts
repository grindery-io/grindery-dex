import { ChainType, ErrorMessageType } from '../../types';
import { getChainIdHex } from './chainHelpers';

export const switchMetamaskNetwork = async (
  currentChainId: string,
  newChain: ChainType,
  successCallback?: () => void,
  errorCallback?: (error: ErrorMessageType) => void
): Promise<boolean> => {
  if (currentChainId !== newChain.chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: getChainIdHex(newChain.chainId),
          },
        ],
      });
    } catch (error: any) {
      if (error?.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: newChain.label,
                chainId: getChainIdHex(newChain.chainId),
                nativeCurrency: {
                  name: newChain.nativeToken || '',
                  decimals: 18,
                  symbol: newChain.nativeToken || '',
                },
                rpcUrls: newChain.rpc || [],
              },
            ],
          });
        } catch (addError) {
          console.error('wallet_addEthereumChain error: network adding failed');
          if (errorCallback) {
            errorCallback({
              type: 'metamask',
              text: 'Network adding failed. Please, add required network to your MetaMask and try again.',
            });
          }
          return false;
        }
      } else {
        console.error('handleOrderCompleteClick error: chain switching failed');
        if (errorCallback) {
          errorCallback({
            type: 'metamask',
            text: 'Network switching failed. Please, switch to required network in your MetaMask and try again.',
          });
        }
        return false;
      }
    }
  }
  if (successCallback) {
    successCallback();
  }
  return true;
};
