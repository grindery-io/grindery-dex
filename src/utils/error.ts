export const getErrorMessage = (error: any, defaultError?: string) => {
  return (
    error?.response?.data?.message ||
    error?.data?.message ||
    error?.message ||
    defaultError ||
    'Unknown error'
  );
};
