import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type MessagesItemType = any;

interface MessagesState {
  items: MessagesItemType[];
  status: string;
}

const initialState: MessagesState = {
  items: [],
  status: 'Uninstantiated',
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<MessagesItemType[]>) {
      state.items = action.payload;
    },
    setItem(state, action: PayloadAction<MessagesItemType>) {
      state.items = state.items.concat(action.payload);
    },
    setStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
  },
});

export const selectMessagesStore = (state: RootState) => state.messages;
export const messagesStoreActions = messagesSlice.actions;
export default messagesSlice.reducer;
