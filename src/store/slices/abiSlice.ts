import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ABIState {
  liquidityWalletAbi: any;
  loading: boolean;
  poolAbi: any;
  satelliteAbi: any;
  tokenAbi: any;
}

const initialState: ABIState = {
  liquidityWalletAbi: null,
  loading: true,
  poolAbi: null,
  satelliteAbi: null,
  tokenAbi: null,
};

const abiSlice = createSlice({
  name: 'abi',
  initialState,
  reducers: {
    setAbis(
      state,
      action: PayloadAction<{
        poolAbi: any;
        tokenAbi: any;
        satelliteAbi: any;
        liquidityWalletAbi: any;
      }>
    ) {
      state.poolAbi = action.payload.poolAbi;
      state.tokenAbi = action.payload.tokenAbi;
      state.satelliteAbi = action.payload.satelliteAbi;
      state.liquidityWalletAbi = action.payload.liquidityWalletAbi;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const selectAbiStore = (state: RootState) => state.abi;
export const abiStoreActions = abiSlice.actions;
export default abiSlice.reducer;
