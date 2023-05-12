import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface NotificationsState {
  token: string;
  isSupported: boolean;
  isCanceled: boolean;
  isSubscribed: boolean;
}

const initialState: NotificationsState = {
  token: '',
  isSupported: false,
  isCanceled: false,
  isSubscribed: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setIsSupported(state, action: PayloadAction<boolean>) {
      state.isSupported = action.payload;
    },
    setIsCanceled(state, action: PayloadAction<boolean>) {
      state.isCanceled = action.payload;
    },
    setIsSubscribed(state, action: PayloadAction<boolean>) {
      state.isSubscribed = action.payload;
    },
  },
});

export const selectNotificationsStore = (state: RootState) =>
  state.notifications;
export const notificationsStoreActions = notificationsSlice.actions;
export default notificationsSlice.reducer;
