import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getFeed, postOrder, getOrders, getOrderById } from '../orders/actions';
import { RootState } from '../store';
import { TFeedsResponse, TNewOrderResponse } from '../../utils/burger-api';

type TInitialState = {
  feedData: TFeedsResponse | undefined;
  isFeedOrdersRequest: boolean;
  feedOrders: TOrder[];
  error: string | undefined;
  ordersList: TOrder[];
  isOrderRequest: boolean;
  orderModalData: TOrder | null;
  modalOrder: TOrder | null;
};

const initialState: TInitialState = {
  feedData: undefined,
  isFeedOrdersRequest: false,
  feedOrders: [],
  error: undefined,
  ordersList: [],
  isOrderRequest: false,
  orderModalData: null,
  modalOrder: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderModalData: (state) => {
      state.orderModalData = null;
      state.isOrderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.isFeedOrdersRequest = true;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.error = action.error.message;
        state.isFeedOrdersRequest = false;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.feedData = action.payload;
        state.feedOrders = action.payload.orders;
        state.isFeedOrdersRequest = false;
      })
      .addCase(postOrder.pending, (state) => {
        state.isOrderRequest = true;
        state.error = undefined;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.isOrderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.isOrderRequest = false;
        state.error = action.error.message;
      })
      .addCase(getOrders.pending, (state) => {
        state.isOrderRequest = true;
        state.error = undefined;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.error.message;
        state.isOrderRequest = false;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.ordersList = action.payload;
        state.isOrderRequest = false;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.modalOrder = action.payload.orders[0];
      });
  }
});

export const getFeedSelector = (state: RootState) => state.order.feedData;
export const getFeedOrdersSelector = (state: RootState) =>
  state.order.feedOrders;
export const getFeedIsOrdersRequest = (state: RootState) =>
  state.order.isFeedOrdersRequest;
export const getIsOrderRequest = (state: RootState) =>
  state.order.isOrderRequest;
export const getOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const getOrdersListSelector = (state: RootState) =>
  state.order.ordersList;
export const getOrderByIdSelector = (state: RootState) =>
  state.order.modalOrder;
export const { resetOrderModalData } = orderSlice.actions;

export default orderSlice.reducer;
