import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { OrderType, ErrorMessageType } from '../../types';

interface OrdersState {
  error: ErrorMessageType;
  items: OrderType[];
  loading: boolean;
}

const initialState: OrdersState = {
  error: { type: '', text: '' },
  items: [],
  loading: true,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrdersItems(state, action: PayloadAction<OrderType[]>) {
      state.items = action.payload;
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

export const {
  setOrdersItems,
  setOrdersLoading,
  setOrdersError,
  clearOrdersError,
} = ordersSlice.actions;

export default ordersSlice.reducer;
