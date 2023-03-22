import { AxiosError } from 'axios';

export const getErrorMessage = (error: any, defaultError?: string): string => {
  return (
    error?.response?.data?.message ||
    error?.data?.message ||
    error?.message ||
    defaultError ||
    'Unknown error'
  );
};

export const getAxiosError = (error: AxiosError): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(error.response.data);
    return (
      error?.response?.data?.toString() ||
      `Error status code: ${error.response.status}`
    );
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(error.request);
    return (
      error?.request?.data?.toString() ||
      `Error status code: ${error.request.status}`
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'Unexpected error';
  }
};
