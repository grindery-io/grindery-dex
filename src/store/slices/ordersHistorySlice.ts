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
    setItems(state, action: PayloadAction<OrderType[]>) {
      state.items = action.payload;
    },
    addItems(state, action: PayloadAction<OrderType[]>) {
      state.items = [...state.items, ...action.payload];
    },
    updateItem(state, action: PayloadAction<OrderType>) {
      if (
        state.items.find((item: OrderType) => item._id === action.payload._id)
      ) {
        state.items = [
          ...state.items.map((item: OrderType) => {
            if (item._id === action.payload._id) {
              return action.payload;
            } else {
              return item;
            }
          }),
        ];
      } else {
        state.items = [...state.items, action.payload];
      }
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

export const selectOrdersHistoryStore = (state: RootState) =>
  state.ordersHistory;
export const ordersHistoryStoreActions = ordersHistorySlice.actions;
export default ordersHistorySlice.reducer;
