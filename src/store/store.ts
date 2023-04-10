import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import faucetReducer from './slices/faucetSlice';
import chainsReducer from './slices/chainsSlice';
import abiReducer from './slices/abiSlice';
import stakesReducer from './slices/stakesSlice';
import automationsReducer from './slices/automationsSlice';
import offersReducer from './slices/offersSlice';
import shopReducer from './slices/shopSlice';
import tradeReducer from './slices/tradeSlice';
import ordersReducer from './slices/ordersSlice';
import ordersHistoryReducer from './slices/ordersHistorySlice';
import walletsReducer from './slices/walletsSlice';

export const store = configureStore({
  reducer: {
    abi: abiReducer,
    automations: automationsReducer,
    chains: chainsReducer,
    faucet: faucetReducer,
    offers: offersReducer,
    orders: ordersReducer,
    ordersHistory: ordersHistoryReducer,
    shop: shopReducer,
    stakes: stakesReducer,
    trade: tradeReducer,
    user: userReducer,
    wallets: walletsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
