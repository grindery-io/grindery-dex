export const formatAddress = (
  address: string,
  start?: number,
  end?: number
): string => {
  return (
    address.substring(0, start || 6) +
    '...' +
    address.substring(address.length - (end || 4))
  );
};
