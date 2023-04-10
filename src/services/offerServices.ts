import axios from 'axios';
import { DELIGHT_API_URL } from '../config';
import { OfferType } from '../types';

export const getOffer = (
  accessToken: string,
  id: string
): Promise<OfferType> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/offers/id?id=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res?.data) {
            resolve(res.data);
          } else {
            reject('Offer not found');
          }
        })
        .catch((err) => {
          console.error('getOffer > axios err=', err);
          reject('Error in getOffer axios');
        });
    } catch (error) {
      console.error('in offerServices > getOffer, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const getOfferById = (
  accessToken: string,
  offerId: string
): Promise<OfferType> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/offers/offerId?offerId=${offerId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res?.data) {
            resolve(res.data);
          } else {
            reject('Offer not found');
          }
        })
        .catch((err) => {
          console.error('getOfferById > axios err=', err);
          reject('Error in getOfferById axios');
        });
    } catch (error) {
      console.error('in offerServices > getOfferById, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const getUserOffers = (accessToken: string): Promise<OfferType[]> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/offers/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          resolve(res?.data || []);
        })
        .catch((err) => {
          console.error('getUserOffers > axios err=', err);
          reject('Error in getUserOffers axios');
        });
    } catch (error) {
      console.error('in offerServices > getUserOffers, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const getAllOffers = (accessToken: string): Promise<OfferType[]> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/offers`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          resolve(res?.data || []);
        })
        .catch((err) => {
          console.error('getAllOffers > axios err=', err);
          reject('Error in getAllOffers axios');
        });
    } catch (error) {
      console.error('in offerServices > getAllOffers, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const searchOffersRequest = (
  accessToken: string,
  query: string
): Promise<OfferType[]> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`${DELIGHT_API_URL}/offers/search?${query}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          resolve(res?.data || []);
        })
        .catch((err: any) => {
          console.error('searchOffersRequest > axios err=', err);
          reject(err?.message || 'Error in searchOffersRequest axios');
        });
    } catch (error) {
      console.error('in offerServices > searchOffersRequest, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};

export const addOffer = (
  accessToken: string,
  body: { [key: string]: any }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${DELIGHT_API_URL}/offers`, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res?.data?.insertedId) {
            resolve(res?.data?.insertedId);
          } else {
            reject('Offer creation failed');
          }
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

export const updateOffer = (
  accessToken: string,
  body: {
    offerId: string;
    isActive: boolean;
  }
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .put(`${DELIGHT_API_URL}/offers/${body.offerId}`, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          resolve(res?.data?.modifiedCount ? true : false);
        })
        .catch((err) => {
          console.error('updateOffer > axios err=', err);
          reject('Error in updateOffer axios');
        });
    } catch (error) {
      console.error('in offerServices > updateOffer, Err===', error);
      reject('System error. Please try again later!');
    }
  });
};
