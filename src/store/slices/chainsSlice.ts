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
    setChainsItems(state, action: PayloadAction<ChainType[]>) {
      state.items = action.payload;
    },
    setChainsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const selectChainsItems = (state: RootState) => state.chains.items;
export const selectChainsLoading = (state: RootState) => state.chains.loading;
export const { setChainsItems, setChainsLoading } = chainsSlice.actions;

export default chainsSlice.reducer;
