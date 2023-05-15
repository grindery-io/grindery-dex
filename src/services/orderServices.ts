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

export const getOrderByIdRequest = (
  accessToken: string,
  id: string
): Promise<OrderType> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/orders/orderId?orderId=${id}`, {
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
  accessToken: string,
  limit?: number,
  offset?: number
): Promise<{ items: OrderType[]; total: number }> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(
          `${DELIGHT_API_URL}/orders/liquidity-provider?${
            typeof limit !== 'undefined' ? 'limit=' + limit + '&' : ''
          }${typeof offset !== 'undefined' ? 'offset=' + offset : ''}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          resolve({
            items: res?.data?.orders || [],
            total: res?.data?.totalCount || 0,
          });
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
  orderId: string,
  completionHash: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .put(
          `${DELIGHT_API_URL}/orders/complete`,
          { orderId, completionHash },
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

export const refreshBuyerOrdersRequest = (
  accessToken: string
): Promise<OrderType[]> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .put(
          `${DELIGHT_API_URL}/orders-onchain/update-order-user`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          let refreshedOrders = res?.data || [];
          axios
            .put(
              `${DELIGHT_API_URL}/orders-onchain/update-order-completion-user`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then((res2) => {
              let orders = [...refreshedOrders, ...(res2?.data || [])];
              resolve(orders);
            })
            .catch((err) => {
              console.error('refreshBuyerOrdersRequest > axios err=', err);
              resolve(refreshedOrders);
            });
        })
        .catch((err) => {
          console.error('refreshBuyerOrdersRequest > axios err=', err);
          reject('Error in refreshBuyerOrdersRequest axios');
        });
    } catch (error) {
      console.error(
        'in offerServices > refreshBuyerOrdersRequest, Err===',
        error
      );
      reject('System error. Please try again later!');
    }
  });
};

export const refreshSellerOrdersRequest = (
  accessToken: string
): Promise<OrderType[]> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .put(
          `${DELIGHT_API_URL}/orders-onchain/update-order-completion-seller`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          resolve(res?.data || []);
        })
        .catch((err) => {
          console.error('refreshSellerOrdersRequest > axios err=', err);
          reject('Error in refreshSellerOrdersRequest axios');
        });
    } catch (error) {
      console.error(
        'in offerServices > refreshSellerOrdersRequest, Err===',
        error
      );
      reject('System error. Please try again later!');
    }
  });
};
