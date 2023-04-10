import axios from 'axios';
import { DELIGHT_API_URL } from '../config';
import { StakeType } from '../types';

export const getStake = (
  accessToken: string,
  id: string
): Promise<StakeType> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/staking/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res?.data) {
            resolve(res.data);
          } else {
            reject('Stake not found');
          }
        })
        .catch((err) => {
          console.error('getStake > axios err=', err);
          reject('Error in getStake axios');
        });
    } catch (error) {
      console.error('in stakeServices > getStake, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const getUserStakes = (accessToken: string): Promise<StakeType[]> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/staking/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          resolve(res?.data || []);
        })
        .catch((err) => {
          console.error('getUserStakes > axios err=', err);
          reject('Error in getUserStakes axios');
        });
    } catch (error) {
      console.error('in stakeServices > getUserStakes, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const addStake = (
  accessToken: string,
  body: { [key: string]: any }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${DELIGHT_API_URL}/staking`, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res?.data?.insertedId) {
            resolve(res?.data?.insertedId);
          } else {
            reject('Stake creation failed');
          }
        })
        .catch((err) => {
          console.error('addStake > axios err=', err);
          reject('Error in addStake axios');
        });
    } catch (error) {
      console.error('in stakeServices > addStake, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const updateStake = (
  accessToken: string,
  {
    chainId,
    amount,
  }: {
    chainId: string;
    amount: string;
  }
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .put(
          `${DELIGHT_API_URL}/staking`,
          { chainId, amount },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          resolve(res?.data?.modifiedCount ? true : false);
        })
        .catch((err) => {
          console.error('addStake > axios err=', err);
          reject('Error in addStake axios');
        });
    } catch (error) {
      console.error('in stakeServices > addStake, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};
