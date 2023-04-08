import axios from 'axios';
import { DELIGHT_API_URL } from '../config/constants';

export const addOrder = (
  accessToken: string,
  body: { [key: string]: any }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${DELIGHT_API_URL}/orders`, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res?.data?.insertedId) {
            resolve(res?.data?.insertedId);
          } else {
            reject('Order creation failed');
          }
        })
        .catch((err) => {
          console.error('addOrder > axios err=', err);
          reject('Error in addOrder axios');
        });
    } catch (error) {
      console.error('in orderServices > addOrder, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};
