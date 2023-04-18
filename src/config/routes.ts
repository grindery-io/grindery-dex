export const ROUTES = {
  BUY: {
    RELATIVE_PATH: '/buy/*',
    FULL_PATH: '/buy',
    TRADE: {
      RELATIVE_PATH: '/trade/*',
      FULL_PATH: '/buy/trade',
      ROOT: { RELATIVE_PATH: '', FULL_PATH: '/buy/trade' },
      SELECT_TO: {
        RELATIVE_PATH: '/select-to',
        FULL_PATH: '/buy/trade/select-to',
      },
      ACCEPT_OFFER: {
        RELATIVE_PATH: '/accept/:offerId',
        FULL_PATH: '/buy/trade/accept/:offerId',
      },
    },
    SHOP: {
      RELATIVE_PATH: '/shop/*',
      FULL_PATH: '/buy/shop',
      ROOT: { RELATIVE_PATH: '', FULL_PATH: '/buy/shop' },
    },
  },
  SELL: {
    RELATIVE_PATH: '/sell/*',
    FULL_PATH: '/sell',
    STAKING: {
      RELATIVE_PATH: '/staking/*',
      FULL_PATH: '/sell/staking/*',
      ROOT: { RELATIVE_PATH: '/', FULL_PATH: '/sell/staking' },
      STAKE: { RELATIVE_PATH: '/stake', FULL_PATH: '/sell/staking/stake' },
      SELECT_CHAIN: {
        RELATIVE_PATH: '/select-chain',
        FULL_PATH: '/sell/staking/select-chain',
      },
      WITHDRAW: {
        RELATIVE_PATH: '/:stakeId/withdraw',
        FULL_PATH: '/sell/staking/:stakeId/withdraw',
      },
    },
    OFFERS: {
      RELATIVE_PATH: '/offers/*',
      FULL_PATH: '/sell/offers/*',
      ROOT: { RELATIVE_PATH: '', FULL_PATH: '/sell/offers' },
      CREATE: { RELATIVE_PATH: '/create', FULL_PATH: '/sell/offers/create' },
      SELECT_CHAIN: {
        RELATIVE_PATH: '/select-chain',
        FULL_PATH: '/sell/offers/select-chain',
      },
      SELECT_TO_CHAIN: {
        RELATIVE_PATH: '/select-to-chain',
        FULL_PATH: '/sell/offers/select-to-chain',
      },
    },
    ORDERS: {
      RELATIVE_PATH: '/orders/*',
      FULL_PATH: '/sell/orders/*',
      ROOT: { RELATIVE_PATH: '', FULL_PATH: '/sell/orders' },
    },
    AUTOMATIONS: {
      RELATIVE_PATH: '/automations/*',
      FULL_PATH: '/sell/automations/*',
      ROOT: { RELATIVE_PATH: '/', FULL_PATH: '/sell/automations' },
      SELECT_CHAIN: {
        RELATIVE_PATH: '/select-chain',
        FULL_PATH: '/sell/automations/select-chain',
      },
    },
    WALLETS: {
      RELATIVE_PATH: '/wallets/*',
      FULL_PATH: '/sell/wallets/*',
      ROOT: { RELATIVE_PATH: '/', FULL_PATH: '/sell/wallets' },
      CREATE: { RELATIVE_PATH: '/create', FULL_PATH: '/sell/wallets/create' },
      SELECT_CHAIN: {
        RELATIVE_PATH: '/select-chain',
        FULL_PATH: '/sell/wallets/select-chain',
      },
      ADD: {
        RELATIVE_PATH: '/:walletId/tokens/add/:tokenSymbol',
        FULL_PATH: '/sell/wallets/:walletId/tokens/add/:tokenSymbol',
      },
      WITHDRAW: {
        RELATIVE_PATH: '/:walletId/tokens/withdraw/:tokenSymbol',
        FULL_PATH: '/sell/wallets/:walletId/tokens/withdraw/:tokenSymbol',
      },
      TOKENS: {
        RELATIVE_PATH: '/:walletId/tokens',
        FULL_PATH: '/sell/wallets/:walletId/tokens',
      },
      SELECT_TOKEN: {
        RELATIVE_PATH: '/:walletId/tokens/select-token',
        FULL_PATH: '/sell/wallets/:walletId/tokens/select-token',
      },
    },
  },
  HISTORY: {
    RELATIVE_PATH: '/history/*',
    FULL_PATH: '/history',
    ROOT: {
      RELATIVE_PATH: '/',
      FULL_PATH: '/history',
    },
  },
  FAUCET: {
    RELATIVE_PATH: '/faucet/*',
    FULL_PATH: '/faucet',
    PLACEHOLDER: {
      RELATIVE_PATH: '/',
      FULL_PATH: '/faucet',
    },
    ROOT: {
      RELATIVE_PATH: '/root',
      FULL_PATH: '/faucet/root',
    },
    SELECT_CHAIN: {
      RELATIVE_PATH: '/select-chain',
      FULL_PATH: '/faucet/select-chain',
    },
  },
};
