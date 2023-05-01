import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { OrderType, ErrorMessageType } from '../../types';

interface OrdersHistoryState {
  error: ErrorMessageType;
  items: OrderType[];
  loading: boolean;
  total: number;
}

const initialState: OrdersHistoryState = {
  error: { type: '', text: '' },
  items: [],
  loading: true,
  total: 0,
};

const ordersHistorySlice = createSlice({
  name: 'ordersHistory',
  initialState,
  reducers: {
    setOrdersHistoryItems(state, action: PayloadAction<OrderType[]>) {
      state.items = action.payload;
    },
    addOrdersHistoryItems(state, action: PayloadAction<OrderType[]>) {
      state.items = [...state.items, ...action.payload];
    },
    setOrdersHistoryTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
    setOrdersHistoryLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setOrdersHistoryError(
      state,
      action: PayloadAction<{ type: string; text: string }>
    ) {
      state.error = action.payload;
    },
    clearOrdersHistoryError(state) {
      state.error = { type: '', text: '' };
    },
  },
});

export const selectOrdersHistoryItems = (state: RootState) =>
  state.ordersHistory.items;
export const selectOrdersHistoryError = (state: RootState) =>
  state.ordersHistory.error;
export const selectOrdersHistoryLoading = (state: RootState) =>
  state.ordersHistory.loading;
export const selectOrdersHistoryHasMore = (state: RootState) =>
  Boolean(state.ordersHistory.items.length < state.ordersHistory.total);

export const {
  setOrdersHistoryItems,
  setOrdersHistoryLoading,
  setOrdersHistoryError,
  clearOrdersHistoryError,
  addOrdersHistoryItems,
  setOrdersHistoryTotal,
} = ordersHistorySlice.actions;

export default ordersHistorySlice.reducer;
