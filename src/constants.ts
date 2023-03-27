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
  '0xe91fc5f6cf045c83d265140abe5271e5600f820c';
export const GRTSATELLITE_CONTRACT_ADDRESS: { [key: string]: string } = {
  'eip155:5': '0xcb65e522f6e12091184fe41d6e34013ea620319a',
  'eip155:97': '0xcB65E522F6e12091184fE41d6E34013ea620319a',
  'eip155:338': '0x8822806A3c89DE7c7d01b05C85C54C92d7581846',
};

export const DEPAY_DISPUTE_ADDRESS =
  '0xef468d8bdE6Cab3e678587415226a3d4bAAc5F01';
export const REALITY_CONTRACT_ADDRESS =
  '0x6F80C5cBCF9FbC2dA2F0675E56A5900BB70Df72f';

export const GRT_CONTRACT_ADDRESS: { [key: string]: string } = {
  'eip155:5': '0x1e3C935E9A45aBd04430236DE959d12eD9763162',
  'eip155:97': '0x3b369B27c641637e5EE7FF9cF516Cb9F8F60cC85',
  'eip155:338': '0xa6Ec5790C26102018b07817fd464E2673a5e2B8D',
};

export const POOL_CONTRACT_ADDRESS: { [key: string]: string } = {
  //'eip155:5': '0x97B434f5f0fc9Ab060918bBb68671bd614fEA6CE',
  //'eip155:97': '0x97B434f5f0fc9Ab060918bBb68671bd614fEA6CE',
  //'eip155:338': '0x2CD3728934dBac6f895421468Ff9B156d28f3aC7',
  'eip155:97': '0xa49f85627F798C7962966a383847aeDF9AbE226c',
  'eip155:5': '0x29e2b23FF53E6702FDFd8C8EBC0d9E1cE44d241A',
};

export const DELIGHT_API_URL = 'https://delight-api.grindery.org';

export const TX_EXPLORER: { [key: string]: string } = {
  'eip155:5': 'https://goerli.etherscan.io/tx/',
  'eip155:97': 'https://testnet.bscscan.com/tx/',
  'eip155:338': 'https://testnet.cronoscan.com/tx/',
};

export const FAUCET_MENU = [
  // {
  //   path: '/',
  //   fullPath: '/faucet',
  //   label: 'GRT Tokens',
  //   external: false,
  // },
  {
    path: 'https://goerlifaucet.com/',
    fullPath: 'https://goerlifaucet.com/',
    label: 'Goerli ETH Tokens',
    external: true,
  },
  // {
  //   path: 'https://testnet.bnbchain.org/faucet-smart',
  //   fullPath: 'https://testnet.bnbchain.org/faucet-smart',
  //   label: 'Binance BNB Tokens',
  //   external: true,
  // },
  // {
  //   path: 'https://cronos.org/faucet',
  //   fullPath: 'https://cronos.org/faucet',
  //   label: 'Cronos CRO Tokens',
  //   external: true,
  // },
];
