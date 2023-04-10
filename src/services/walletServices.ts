import axios from 'axios';
import { DELIGHT_API_URL } from '../config';
import { LiquidityWalletType } from '../types';

export const addWalletRequest = (
  accessToken: string,
  body: { [key: string]: any }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${DELIGHT_API_URL}/liquidity-wallets`, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res?.data?.insertedId) {
            resolve(res?.data?.insertedId);
          } else {
            reject('Wallet creation failed');
          }
        })
        .catch((err) => {
          console.error('addWalletRequest > axios err=', err);
          reject('Error in addWalletRequest axios');
        });
    } catch (error) {
      console.error('in walletServices > addWalletRequest, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const getWalletRequest = (
  accessToken: string,
  id: string
): Promise<LiquidityWalletType> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/liquidity-wallets/id/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res?.data) {
            resolve(res.data);
          } else {
            reject('Wallet not found');
          }
        })
        .catch((err) => {
          console.error('getWalletRequest > axios err=', err);
          reject('Error in getWalletRequest axios');
        });
    } catch (error) {
      console.error('in walletServices > getWalletRequest, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const getWalletsRequest = (
  accessToken: string
): Promise<LiquidityWalletType[]> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/liquidity-wallets/all`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          resolve(res?.data || []);
        })
        .catch((err) => {
          console.error('getWalletsRequest > axios err=', err);
          reject('Error in getWalletsRequest axios');
        });
    } catch (error) {
      console.error('in walletServices > getWalletsRequest, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const updateWalletRequest = (
  accessToken: string,
  body: { [key: string]: any }
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .put(`${DELIGHT_API_URL}/liquidity-wallets`, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          resolve(res?.data?.modifiedCount ? true : false);
        })
        .catch((err) => {
          console.error('updateWalletRequest > axios err=', err);
          reject('Error in updateWalletRequest axios');
        });
    } catch (error) {
      console.error('in walletServices > updateWalletRequest, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const getWalletBalanceRequest = (
  accessToken: string,
  chainId: string,
  tokenAddress: string,
  walletAddress: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(
          `${DELIGHT_API_URL}/view-blockchains/balance-token?chainId=${chainId}&tokenAddress=${tokenAddress}&address=${walletAddress}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          resolve(res?.data || '0');
        })
        .catch((err) => {
          console.error('getWalletBalanceRequest > axios err=', err);
          reject('Error in getWalletBalanceRequest axios');
        });
    } catch (error) {
      console.error(
        'in walletServices > getWalletBalanceRequest, Err===',
        error
      );
      reject('System error. Please try again later!');
    }
  });
};
