import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ChainType } from '../../types';

interface ChainsState {
  items: ChainType[];
  loading: boolean;
}

const initialState: ChainsState = {
  items: [],
  loading: true,
};

const chainsSlice = createSlice({
  name: 'chains',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<ChainType[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const selectChainsStore = (state: RootState) => state.chains;
export const chainsStoreActions = chainsSlice.actions;
export default chainsSlice.reducer;
