import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type MessagesItemType = any;

interface ABIState {
  items: MessagesItemType[];
  status: string;
}

const initialState: ABIState = {
  items: [],
  status: 'Uninstantiated',
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessagesItems(state, action: PayloadAction<MessagesItemType[]>) {
      state.items = action.payload;
    },
    setMessagesItem(state, action: PayloadAction<MessagesItemType>) {
      state.items = state.items.concat(action.payload);
    },
    setMessagesStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
  },
});

export const selectMessagesItems = (state: RootState) => state.messages.items;
export const selectMessagesStatus = (state: RootState) => state.messages.status;

export const { setMessagesItems, setMessagesItem, setMessagesStatus } =
  messagesSlice.actions;

export default messagesSlice.reducer;
