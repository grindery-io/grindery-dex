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

export const store = configureStore({
  reducer: {
    user: userReducer,
    trade: tradeReducer,
    shop: shopReducer,
    ordersHistory: ordersHistoryReducer,
    faucet: faucetReducer,
    stakes: stakesReducer,
    offers: offersReducer,
    orders: ordersReducer,
    automations: automationsReducer,
    chains: chainsReducer,
    abi: abiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
