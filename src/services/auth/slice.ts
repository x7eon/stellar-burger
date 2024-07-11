import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  updateUserData
} from './actions';
import { RootState } from '../store';

type TInitialState = {
  user: TUser;
  isAuthCheked: boolean;
  isAuth: boolean;
  isAuthRequest: boolean;
  error: string | undefined;
};

const initialState: TInitialState = {
  user: {
    name: '',
    email: ''
  },
  isAuthCheked: true, // флаг для статуса проверки токена пользователя
  isAuth: false, // флаг для статуса авторизации
  isAuthRequest: false, // флаг для статуса проверки запроса авторизации
  error: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthCheked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isAuthRequest = true;
        state.error = undefined;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthRequest = false;
        state.error = action.error.message;
        state.isAuthCheked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthRequest = false;
        state.user = action.payload.user;
        state.isAuth = true;
        state.isAuthCheked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuth = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = {
          name: '',
          email: ''
        };
        state.isAuth = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthCheked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthCheked = true;
        state.user = action.payload.user;
        state.isAuth = true;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthRequest = false;
      })
      .addCase(updateUserData.pending, (state) => {
        state.isAuthRequest = true;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthRequest = false;
      });
  }
});

export const getUserSelector = (store: RootState) => store.user.user;
export const isAuthSelector = (store: RootState) => store.user.isAuth;
export const isAuthChekedSelector = (store: RootState) =>
  store.user.isAuthCheked;
export const isAuthRequestSelector = (store: RootState) =>
  store.user.isAuthRequest;

export default userSlice.reducer;
