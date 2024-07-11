import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  TLoginData,
  TRegisterData,
  getUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const logoutUser = createAsyncThunk('user/logutUser', async () => {
  const response = await logoutApi();
  deleteCookie('accessToken');
  localStorage.clear();
  return response;
});

export const getUser = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
);

export const updateUserData = createAsyncThunk(
  'user/updateData',
  async (user: TRegisterData) => await updateUserApi(user)
);
