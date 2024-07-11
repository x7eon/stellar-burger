import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getFeed = createAsyncThunk(
  'order/getFeed',
  async () => await getFeedsApi()
);

export const postOrder = createAsyncThunk(
  'order/postOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const getOrders = createAsyncThunk(
  'order/getAll',
  async () => await getOrdersApi()
);

export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (id: number) => await getOrderByNumberApi(id)
);
