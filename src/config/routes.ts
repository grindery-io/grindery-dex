export const ROUTES = {
  BUY: {
    RELATIVE_PATH: '/buy/*',
    FULL_PATH: '/buy',
    TRADE: {
      RELATIVE_PATH: '/trade/*',
      FULL_PATH: '/buy/trade',
      ROOT: { RELATIVE_PATH: '', FULL_PATH: '/buy/trade' },
      SELECT_FROM: {
        RELATIVE_PATH: '/select-from',
        FULL_PATH: '/buy/trade/select-from',
      },
      SELECT_TO: {
        RELATIVE_PATH: '/select-to',
        FULL_PATH: '/buy/trade/select-to',
      },
      ACCEPT_OFFER: {
        RELATIVE_PATH: '/accept/:offerId',
        FULL_PATH: '/buy/trade/accept/:offerId',
      },
      HISTORY: {
        RELATIVE_PATH: '/history',
        FULL_PATH: '/buy/trade/history',
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
    AUTOMATIONS: {
      RELATIVE_PATH: '/automations/*',
      FULL_PATH: '/sell/automations/*',
      ROOT: { RELATIVE_PATH: '/', FULL_PATH: '/sell/automations' },
      SELECT_CHAIN: {
        RELATIVE_PATH: '/select-chain',
        FULL_PATH: '/sell/automations/select-chain',
      },
    },
  },
  FAUCET: {
    RELATIVE_PATH: '/*',
    FULL_PATH: '/faucet/*',
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
