export const getOrderIdFromReceipt = (receipt: any): string => {
  return receipt?.logs?.[0]?.topics?.[2] || '';
};
