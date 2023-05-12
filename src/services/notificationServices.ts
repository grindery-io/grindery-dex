import axios from 'axios';
import { DELIGHT_API_URL } from '../config';

export const saveNotificationsTokenRequest = (
  accessToken: string,
  token: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .put(
          `${DELIGHT_API_URL}/push-notifications`,
          {
            token,
          },
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
            reject('Notification not saved');
          }
        })
        .catch((err) => {
          console.error('saveNotificationsTokenRequest > axios err=', err);
          reject('Error in saveNotificationsTokenRequest axios');
        });
    } catch (error) {
      console.error(
        'in notificationServices > saveNotificationsTokenRequest, Err===',
        error
      );
      reject('System error. Please try again later!');
    }
  });
};

export const deleteNotificationsTokenRequest = (
  accessToken: string,
  token: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .delete(`${DELIGHT_API_URL}/push-notifications/${token}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res?.data) {
            resolve(res.data);
          } else {
            reject('Notification not saved');
          }
        })
        .catch((err) => {
          console.error('deleteNotificationsTokenRequest > axios err=', err);
          reject('Error in deleteNotificationsTokenRequest axios');
        });
    } catch (error) {
      console.error(
        'in notificationServices > deleteNotificationsTokenRequest, Err===',
        error
      );
      reject('System error. Please try again later!');
    }
  });
};
