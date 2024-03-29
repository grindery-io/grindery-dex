import axios from 'axios';
import { ChainType } from '../types';
import { DELIGHT_API_URL } from '../config';
import { sortTokens } from '../utils';

export const getChainsWithTokens = (): Promise<ChainType[]> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/blockchains/active`)
        .then((res) => {
          try {
            axios
              .get(`${DELIGHT_API_URL}/tokens/active`)
              .then((res2) => {
                // remove data formatting and enriching away from services
                const chainsWithTokens = (res?.data || [])
                  .filter((chain: any) => chain.isActive)
                  .map((chain: any) => ({
                    ...chain,
                    value: chain.caipId,
                    nativeToken: chain.nativeTokenSymbol || '',
                    tokens: sortTokens(
                      (res2?.data || []).filter(
                        (token: any) => token.chainId === chain.chainId
                      )
                    ),
                  }));
                resolve(chainsWithTokens);
              })
              .catch((err) => {
                console.error('getChainsWithTokens > axios err=', err);
                reject('Error in getChainsWithTokens axios');
              });
          } catch (error) {
            console.error(
              'in chainServices > getChainsWithTokens, Err===',
              error
            );
            reject('System error. Please try again later!');
          }
        })
        .catch((err) => {
          console.error('getChains > axios err=', err);
          reject('Error in getChains axios');
        });
    } catch (error) {
      console.error('in chainServices > getChains, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};
