import axios from 'axios';
import { DELIGHT_API_URL } from '../config';

export const addGsheetRowRequest = (
  accessToken: string,
  body: { [key: string]: any }
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${DELIGHT_API_URL}/gsheets`, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          resolve(true);
        })
        .catch((err) => {
          console.error('addOffer > axios err=', err);
          reject('Error in addOffer axios');
        });
    } catch (error) {
      console.error('in offerServices > addOffer, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};
