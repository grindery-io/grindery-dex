import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AppState {
  counter: number;
}

const initialState: AppState = {
  counter: 0,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    increment(state) {
      state.counter = state.counter + 1;
    },
    decrement(state) {
      state.counter = state.counter - 1;
    },
  },
});

export const selectCount = (state: RootState) => state.app.counter;
export const { increment, decrement } = appSlice.actions;
export default appSlice.reducer;
