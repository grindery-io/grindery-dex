import axios from 'axios';
import { DELIGHT_API_URL } from '../config';
import { OrderType } from '../types';

export const addOrderRequest = (
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

export const getOrderRequest = (
  accessToken: string,
  id: string
): Promise<OrderType> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/orders/id?id=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res?.data) {
            resolve(res.data);
          } else {
            reject('Order not found');
          }
        })
        .catch((err) => {
          console.error('getOrderRequest > axios err=', err);
          reject('Error in getOrderRequest axios');
        });
    } catch (error) {
      console.error('in orderServices > getOrderRequest, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const getBuyerOrdersRequest = (
  accessToken: string,
  limit?: number,
  offset?: number
): Promise<{ items: OrderType[]; total: number }> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(
          `${DELIGHT_API_URL}/orders/user?${
            typeof limit !== 'undefined' ? 'limit=' + limit + '&' : ''
          }${typeof offset !== 'undefined' ? 'offset=' + offset : ''}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          console.log('getBuyerOrdersRequest > axios res=', res);
          resolve({
            items: res?.data?.orders || [],
            total: res?.data?.totalCount || 0,
          });
        })
        .catch((err) => {
          console.error('getBuyerOrdersRequest > axios err=', err);
          reject('Error in getBuyerOrdersRequest axios');
        });
    } catch (error) {
      console.error('in orderServices > getBuyerOrdersRequest, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const getSellerOrdersRequest = (
  accessToken: string
): Promise<OrderType[]> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/orders/liquidity-provider`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          resolve(res?.data || []);
        })
        .catch((err) => {
          console.error('getSellerOrdersRequest > axios err=', err);
          reject('Error in getSellerOrdersRequest axios');
        });
    } catch (error) {
      console.error('in orderServices > getSellerOrdersRequest, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const completeSellerOrderRequest = (
  accessToken: string,
  orderId: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .put(
          `${DELIGHT_API_URL}/orders/complete`,
          { orderId },
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
          console.error('completeSellerOrderRequest > axios err=', err);
          reject('Error in completeSellerOrderRequest axios');
        });
    } catch (error) {
      console.error(
        'in orderServices > completeSellerOrderRequest, Err===',
        error
      );
      reject('System error. Please try again later!');
    }
  });
};
