import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface UserState {
  accessToken: string;
  address: string;
  chain: string;
  chainId: string;
  id: string;
  isAdmin: boolean;
  isAdminLoading: boolean;
}

const initialState: UserState = {
  accessToken: '',
  address: '',
  chain: '',
  chainId: '',
  id: '',
  isAdmin: false,
  isAdminLoading: true,
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
    setUserIsAdmin(state, action: PayloadAction<boolean>) {
      state.isAdmin = action.payload;
    },
    setUserIsAdminLoading(state, action: PayloadAction<boolean>) {
      state.isAdminLoading = action.payload;
    },
  },
});

export const selectUserId = (state: RootState) => state.user.id;
export const selectUserAddress = (state: RootState) => state.user.address;
export const selectUserChain = (state: RootState) => state.user.chain;
export const selectUserChainId = (state: RootState) => state.user.chainId;
export const selectUserAccessToken = (state: RootState) =>
  state.user.accessToken;
export const selectUserIsAdmin = (state: RootState) => state.user.isAdmin;
export const selectUserIsAdminLoading = (state: RootState) =>
  state.user.isAdminLoading;
export const {
  setUserId,
  setUserAddress,
  setUserChain,
  setUserAccessToken,
  setUserIsAdmin,
  setUserIsAdminLoading,
} = userSlice.actions;
export default userSlice.reducer;
