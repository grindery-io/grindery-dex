import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { OrderType, ErrorMessageType } from '../../types';

interface OrdersState {
  error: ErrorMessageType;
  items: OrderType[];
  loading: boolean;
  total: number;
}

const initialState: OrdersState = {
  error: { type: '', text: '' },
  items: [],
  loading: true,
  total: 0,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<OrderType[]>) {
      state.items = action.payload;
    },
    addItems(state, action: PayloadAction<OrderType[]>) {
      state.items = [...state.items, ...action.payload];
    },
    setTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<{ type: string; text: string }>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = { type: '', text: '' };
    },
  },
});

export const selectOrdersStore = (state: RootState) => state.orders;
export const ordersStoreActions = ordersSlice.actions;
export default ordersSlice.reducer;
