import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import faucetReducer from './slices/faucetSlice';
import chainsReducer from './slices/chainsSlice';
import abiReducer from './slices/abiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chains: chainsReducer,
    abi: abiReducer,
    faucet: faucetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
