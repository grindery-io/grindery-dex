import axios from 'axios';
import { ChainType } from '../types/ChainType';
import { DELIGHT_API_URL } from '../config/constants';

export const getChainsWithTokens = (
  accessToken: string
): Promise<ChainType[]> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/blockchains/active`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          try {
            axios
              .get(`${DELIGHT_API_URL}/tokens/active`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              })
              .then((res2) => {
                console.log('getChainsWithTokens > axios res=', res2);

                // TODO: remove data formatting outside of services
                const chainsWithTokens = (res?.data || []).map(
                  (chain: any) => ({
                    ...chain,
                    value: chain.caipId,
                    tokens: (res2?.data || []).filter(
                      (token: any) => token.chainId === chain.chainId
                    ),
                  })
                );
                resolve(chainsWithTokens);
              })
              .catch((err) => {
                console.log('getChainsWithTokens > axios err=', err);
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
          console.log('getChains > axios err=', err);
          reject('Error in getChains axios');
        });
    } catch (error) {
      console.error('in chainServices > getChains, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};
