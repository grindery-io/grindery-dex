export const ROUTES = {
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
