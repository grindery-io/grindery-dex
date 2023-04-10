import axios from 'axios';
import { DELIGHT_API_URL } from '../config';

export const isUserAdmin = (accessToken: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/admins`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res.data) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.error('isUserAdmin > axios err=', err);
          reject('Error in isUserAdmin axios');
        });
    } catch (error) {
      console.error('in userServices > isUserAdmin, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};
