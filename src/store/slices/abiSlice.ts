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
    setAbiLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const selectAbiLoading = (state: RootState) => state.abi.loading;
export const selectPoolAbi = (state: RootState) => state.abi.poolAbi;
export const selectTokenAbi = (state: RootState) => state.abi.tokenAbi;
export const selectSatelliteAbi = (state: RootState) => state.abi.satelliteAbi;
export const selectLiquidityWalletAbi = (state: RootState) =>
  state.abi.liquidityWalletAbi;
export const { setAbiLoading, setAbis } = abiSlice.actions;

export default abiSlice.reducer;
