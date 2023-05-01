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
    setOrdersItems(state, action: PayloadAction<OrderType[]>) {
      state.items = action.payload;
    },
    addOrdersItems(state, action: PayloadAction<OrderType[]>) {
      state.items = [...state.items, ...action.payload];
    },
    setOrdersTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
    setOrdersLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setOrdersError(
      state,
      action: PayloadAction<{ type: string; text: string }>
    ) {
      state.error = action.payload;
    },
    clearOrdersError(state) {
      state.error = { type: '', text: '' };
    },
  },
});

export const selectOrdersItems = (state: RootState) => state.orders.items;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersHasMore = (state: RootState) =>
  Boolean(state.orders.items.length < state.orders.total);

export const {
  setOrdersItems,
  setOrdersLoading,
  setOrdersError,
  clearOrdersError,
  addOrdersItems,
  setOrdersTotal,
} = ordersSlice.actions;

export default ordersSlice.reducer;
