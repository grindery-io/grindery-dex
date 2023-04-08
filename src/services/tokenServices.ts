import axios from 'axios';
import { DELIGHT_API_URL } from '../config/constants';

export const getTokenPriceById = (
  accessToken: string,
  tokenId: string
): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/coinmarketcap?token=${tokenId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          resolve(res?.data?.price || null);
        })
        .catch((err) => {
          console.error('getTokenPriceById > axios err=', err);
          reject('Error in getTokenPriceById axios');
        });
    } catch (error) {
      console.error('in tokenServices > getTokenPriceById, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const getTokenBalanceRequest = (
  accessToken: string,
  chainId: string,
  address: string,
  tokenAddress: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(
          `${DELIGHT_API_URL}/view-blockchains/balance-token?chainId=${chainId}&address=${address}&tokenAddress=${tokenAddress}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          resolve(res?.data ? (res.data / 10 ** 18).toString() : '0');
        })
        .catch((err) => {
          console.error('getTokenBalanceRequest > axios err=', err);
          reject('Error in getTokenBalanceRequest axios');
        });
    } catch (error) {
      console.error('in tokenServices > getTokenBalanceRequest, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};
