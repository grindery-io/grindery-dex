import axios from 'axios';

export const getAbis = async () => {
  const promises = [
    'https://raw.githubusercontent.com/grindery-io/Depay-Reality/main/abis/GrtPoolV2.json',
    'https://raw.githubusercontent.com/grindery-io/Depay-Reality/main/abis/ERC20Sample.json',
    'https://raw.githubusercontent.com/grindery-io/Depay-Reality/main/abis/GrtLiquidityWallet.json',
  ].map(async (url: string) => {
    const result = await axios.get(url).catch(() => {
      return null;
    });
    return result?.data || null;
  });

  const results = await Promise.all(promises);

  return {
    poolAbi: results[0],
    tokenAbi: results[1],
    liquidityWalletAbi: results[2],
    satelliteAbi: null,
  };
};
