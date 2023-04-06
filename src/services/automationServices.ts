import axios from 'axios';
import { DELIGHT_API_URL } from '../config/constants';

export const getBotAddress = (
  accessToken: string,
  chainId: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(
          `${DELIGHT_API_URL}/view-blockchains/drone-address?chainId=${chainId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          if (res?.data) {
            resolve(res.data);
          } else {
            reject('Bot address not found');
          }
        })
        .catch((err) => {
          console.error('getBotAddress > axios err=', err);
          reject('Error in getBotAddress axios');
        });
    } catch (error) {
      console.error('in automationServices > getBotAddress, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};
