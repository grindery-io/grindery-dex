import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface UserState {
  id: string;
  address: string;
  chain: string;
  chainId: string;
  accessToken: string;
}

const initialState: UserState = {
  id: '',
  address: '',
  chain: '',
  chainId: '',
  accessToken: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<string>) {
      state.id = action.payload || '';
    },
    setUserAddress(state, action: PayloadAction<string>) {
      state.address = action.payload || '';
    },
    setUserChain(state, action: PayloadAction<string>) {
      state.chain = action.payload || '';
      state.chainId = (action.payload || '').split(':').pop() || '';
    },
    setUserAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload || '';
    },
  },
});

export const selectUserId = (state: RootState) => state.user.id;
export const selectUserAddress = (state: RootState) => state.user.address;
export const selectUserChain = (state: RootState) => state.user.chain;
export const selectUserChainId = (state: RootState) => state.user.chainId;
export const selectUserAccessToken = (state: RootState) =>
  state.user.accessToken;
export const { setUserId, setUserAddress, setUserChain, setUserAccessToken } =
  userSlice.actions;
export default userSlice.reducer;
