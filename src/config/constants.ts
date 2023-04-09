export const SCREEN = {
  TABLET: '768px',
  TABLET_XL: '1024px',
  DESKTOP: '1280px',
  DESKTOP_XL: '1600px',
};

export const ICONS: { [key: string]: string } = {
  DISCONNECT: '/images/icons/disconnect.svg',
  CHECKBOX_CHECKED: '/images/icons/checkbox-checked.svg',
  CHECKBOX_EMPTY: '/images/icons/checkbox-empty.svg',
  COPY: '/images/icons/copy.svg',
  SOCIAL_DISCORD: '/images/icons/social-discord.png',
  SOCIAL_TG: '/images/icons/social-tg.png',
  SOCIAL_TWITTER: '/images/icons/social-twitter.png',
};

export const GRTPOOL_CONTRACT_ADDRESS =
  process.env.REACT_APP_GRTPOOL_CONTRACT_ADDRESS;

export const GRTSATELLITE_CONTRACT_ADDRESS: { [key: string]: any } = {
  'eip155:5': process.env.REACT_APP_GRTSATELLITE_CONTRACT_ADDRESS_EIP155_5,
  'eip155:97': process.env.REACT_APP_GRTSATELLITE_CONTRACT_ADDRESS_EIP155_97,
  'eip155:338': process.env.REACT_APP_GRTSATELLITE_CONTRACT_ADDRESS_EIP155_338,
};

export const DEPAY_DISPUTE_ADDRESS =
  process.env.REACT_APP_DEPAY_DISPUTE_ADDRESS;
export const REALITY_CONTRACT_ADDRESS =
  process.env.REACT_APP_REALITY_CONTRACT_ADDRESS;

export const GRT_CONTRACT_ADDRESS: { [key: string]: any } = {
  'eip155:5': process.env.REACT_APP_GRT_CONTRACT_ADDRESS_EIP155_5,
  'eip155:97': process.env.REACT_APP_GRT_CONTRACT_ADDRESS_EIP155_97,
  'eip155:338': process.env.REACT_APP_GRT_CONTRACT_ADDRESS_EIP155_338,
};

export const POOL_CONTRACT_ADDRESS: { [key: string]: any } = {
  'eip155:97': process.env.REACT_APP_POOL_CONTRACT_ADDRESS_EIP155_97,
  'eip155:5': process.env.REACT_APP_POOL_CONTRACT_ADDRESS_EIP155_5,
};

export const DELIGHT_API_URL = process.env.REACT_APP_DELIGHT_API_URL;

export const TX_EXPLORER: { [key: string]: any } = {
  'eip155:5': process.env.REACT_APP_TX_EXPLORER_EIP155_5,
  'eip155:97': process.env.REACT_APP_TX_EXPLORER_EIP155_97,
  'eip155:338': process.env.REACT_APP_TX_EXPLORER_EIP155_338,
};

export const FAUCET_MENU = [
  {
    path: 'https://goerlifaucet.com/',
    fullPath: 'https://goerlifaucet.com/',
    label: 'Goerli ETH Tokens',
    external: true,
  },
];

// Temporary disabled faucet menu
/*export const FAUCET_MENU = [
  {
    path: '/',
    fullPath: '/faucet',
    label: 'GRT Tokens',
    external: false,
  },
  {
    path: 'https://goerlifaucet.com/',
    fullPath: 'https://goerlifaucet.com/',
    label: 'Goerli ETH Tokens',
    external: true,
  },
  {
    path: 'https://testnet.bnbchain.org/faucet-smart',
    fullPath: 'https://testnet.bnbchain.org/faucet-smart',
    label: 'Binance BNB Tokens',
    external: true,
  },
  {
    path: 'https://cronos.org/faucet',
    fullPath: 'https://cronos.org/faucet',
    label: 'Cronos CRO Tokens',
    external: true,
  },
];*/
