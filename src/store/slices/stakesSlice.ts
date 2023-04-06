import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { StakeType } from '../../types/StakeType';

interface StakesState {
  loading: boolean;
  items: StakeType[];
}

const initialState: StakesState = {
  loading: true,
  items: [],
};

const stakesSlice = createSlice({
  name: 'stakes',
  initialState,
  reducers: {
    setStakesItems(state, action: PayloadAction<StakeType[]>) {
      state.items = action.payload;
    },
    setStakesLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const selectStakesItems = (state: RootState) => state.stakes.items;
export const selectStakesLoading = (state: RootState) => state.stakes.loading;
export const { setStakesItems, setStakesLoading } = stakesSlice.actions;

export default stakesSlice.reducer;
