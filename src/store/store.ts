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

export const store = configureStore({
  reducer: {
    user: userReducer,
    trade: tradeReducer,
    shop: shopReducer,
    faucet: faucetReducer,
    stakes: stakesReducer,
    offers: offersReducer,
    automations: automationsReducer,
    chains: chainsReducer,
    abi: abiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
