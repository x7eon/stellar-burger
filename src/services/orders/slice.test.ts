import { expect, describe, jest, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { resetOrderModalData } from './slice';
import { getFeed, postOrder, getOrders, getOrderById } from './actions';

jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn(() =>
    Promise.resolve({
      orders: [
        {
          _id: 1,
          status: '',
          name: 'one',
          createdAt: '12',
          updatedAt: '',
          number: 1,
          ingredients: ['a', 'b']
        },
        {
          _id: 2,
          status: '',
          name: 'two',
          createdAt: '13',
          updatedAt: '',
          number: 2,
          ingredients: ['b', 'd']
        }
      ],
      total: 50,
      totalToday: 12
    })
  ),
  orderBurgerApi: jest.fn(() =>
    Promise.resolve({
      order: {
        _id: '1',
        status: '',
        name: 'order1',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: ['1a', '2b']
      },
      name: 'order'
    })
  ),
  getOrdersApi: jest.fn(() =>
    Promise.resolve({
      orders: [
        {
          _id: 1,
          status: '',
          name: 'one',
          createdAt: '12',
          updatedAt: '',
          number: 1,
          ingredients: ['a', 'b']
        },
        {
          _id: 2,
          status: '',
          name: 'two',
          createdAt: '13',
          updatedAt: '',
          number: 2,
          ingredients: ['b', 'd']
        }
      ]
    })
  ),
  getOrderByNumberApi: jest.fn(() =>
    Promise.resolve({
      orders: [
        {
          _id: 1,
          status: '',
          name: 'one',
          createdAt: '12',
          updatedAt: '',
          number: 1,
          ingredients: ['a', 'b']
        }
      ]
    })
  )
}));

describe('тест orderSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('[orderSliceReducer / getFeed] тест успешной загрузки ленты заказов (fulfilled)', async () => {
    const mockFeedResponse = {
      orders: [
        {
          _id: 1,
          status: '',
          name: 'one',
          createdAt: '12',
          updatedAt: '',
          number: 1,
          ingredients: ['a', 'b']
        },
        {
          _id: 2,
          status: '',
          name: 'two',
          createdAt: '13',
          updatedAt: '',
          number: 2,
          ingredients: ['b', 'd']
        }
      ],
      total: 50,
      totalToday: 12
    };
    const store = configureStore({ reducer: { order: reducer } });
    await store.dispatch(getFeed());
    const state = store.getState().order;

    expect(state.feedOrders).toEqual(mockFeedResponse.orders);
    expect(state.feedData).toEqual(mockFeedResponse);
    expect(state.isFeedOrdersRequest).toBe(false);
  });

  test('[orderSliceReducer / getFeed] тест ошибки загрузки ленты заказов (rejected)', async () => {
    // Мокируем ошибку API
    jest
      .spyOn(require('../../utils/burger-api'), 'getFeedsApi')
      .mockRejectedValueOnce(new Error('Ошибка загрузки'));

    const store = configureStore({ reducer: { order: reducer } });
    await store.dispatch(getFeed());
    const state = store.getState().order;

    expect(state.feedOrders).toEqual([]);
    expect(state.error).toBe('Ошибка загрузки');
    expect(state.isFeedOrdersRequest).toBe(false);
  });

  test('[orderSliceReducer / getFeed] тест ожидания загрузки ленты заказов (pending)', async () => {
    const store = configureStore({ reducer: { order: reducer } });
    const promise = store.dispatch(getFeed());
    const state = store.getState().order;

    expect(state.isFeedOrdersRequest).toBe(true);
    await promise;
  });

  test('[orderSliceReducer / postOrder] тест успешного заказа (fulfilled)', async () => {
    const mockFeedResponse = {
      order: {
        _id: '1',
        status: '',
        name: 'order1',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: ['1a', '2b']
      },
      name: 'order'
    };
    const store = configureStore({ reducer: { order: reducer } });
    await store.dispatch(postOrder(['1a', '2b']));
    const state = store.getState().order;

    expect(state.isFeedOrdersRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockFeedResponse.order);
  });

  test('[orderSliceReducer / postOrder] тест ожидания отправки заказа и очистки ошибки (pending)', async () => {
    const store = configureStore({ reducer: { order: reducer } });
    const promise = store.dispatch(postOrder(['1a', '2b']));
    const state = store.getState().order;

    expect(state.isOrderRequest).toBe(true);
    expect(state.error).toBe(undefined);
    await promise;
  });

  test('[orderSliceReducer / postOrder] тест ошибки при отправке заказа (rejected)', async () => {
    jest
      .spyOn(require('../../utils/burger-api'), 'orderBurgerApi')
      .mockRejectedValueOnce(new Error('Ошибка отправки заказа'));

    const store = configureStore({ reducer: { order: reducer } });
    await store.dispatch(postOrder(['1a', '2b']));
    const state = store.getState().order;

    expect(state.isOrderRequest).toBe(false);
    expect(state.error).toBe('Ошибка отправки заказа');
  });

  test('[orderSliceReducer / getOrders] тест успешного получения заказов (fulfilled)', async () => {
    const mockOrdersList = {
      orders: [
        {
          _id: 1,
          status: '',
          name: 'one',
          createdAt: '12',
          updatedAt: '',
          number: 1,
          ingredients: ['a', 'b']
        },
        {
          _id: 2,
          status: '',
          name: 'two',
          createdAt: '13',
          updatedAt: '',
          number: 2,
          ingredients: ['b', 'd']
        }
      ]
    };

    const store = configureStore({ reducer: { order: reducer } });
    await store.dispatch(getOrders());
    const state = store.getState().order;

    expect(state.isOrderRequest).toBe(false);
    expect(state.ordersList).toEqual(mockOrdersList);
  });

  test('[orderSliceReducer / getOrders] тест ожидания получения заказов и очистки ошибки (pending)', async () => {
    const store = configureStore({ reducer: { order: reducer } });
    const promise = store.dispatch(getOrders());
    const state = store.getState().order;

    expect(state.isOrderRequest).toBe(true);
    expect(state.error).toBe(undefined);
    await promise;
  });

  test('[orderSliceReducer / getOrders] тест ошибки при запросе заказов (rejected)', async () => {
    jest
      .spyOn(require('../../utils/burger-api'), 'getOrdersApi')
      .mockRejectedValueOnce(new Error('Ошибка загрузки'));

    const store = configureStore({ reducer: { order: reducer } });
    await store.dispatch(getOrders());
    const state = store.getState().order;

    expect(state.isOrderRequest).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  test('[orderSliceReducer / getOrderById] тест успешного получения заказа по id (fulfilled)', async () => {
    const mockOrder = {
      _id: 1,
      status: '',
      name: 'one',
      createdAt: '12',
      updatedAt: '',
      number: 1,
      ingredients: ['a', 'b']
    };
    const store = configureStore({ reducer: { order: reducer } });
    await store.dispatch(getOrderById(1));
    const state = store.getState().order;

    expect(state.modalOrder).toEqual(mockOrder);
  });

  test('[orderSliceReducer / resetOrderModalData] тест очистки данных в модалке заказа', async () => {
    const initialState = {
      order: {
        feedData: undefined,
        isFeedOrdersRequest: false,
        feedOrders: [],
        error: undefined,
        ordersList: [],
        isOrderRequest: true,
        orderModalData: {
          _id: '1',
          status: '',
          name: 'order1',
          createdAt: '',
          updatedAt: '',
          number: 1,
          ingredients: ['1a', '2b']
        },
        modalOrder: null
      }
    };

    const store = configureStore({
      reducer: { order: reducer },
      preloadedState: initialState
    });
    store.dispatch(resetOrderModalData());
    const state = store.getState().order;

    expect(state.orderModalData).toBe(null);
    expect(state.isOrderRequest).toBe(false);
  });
});
