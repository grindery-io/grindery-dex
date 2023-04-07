import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import faucetReducer from './slices/faucetSlice';
import chainsReducer from './slices/chainsSlice';
import abiReducer from './slices/abiSlice';
import stakesReducer from './slices/stakesSlice';
import automationsReducer from './slices/automationsSlice';
import offersReducer from './slices/offersSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chains: chainsReducer,
    abi: abiReducer,
    faucet: faucetReducer,
    stakes: stakesReducer,
    automations: automationsReducer,
    offers: offersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
