import { expect, describe, jest, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './slice';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserData
} from './actions';
import { setCookie, deleteCookie } from '../../utils/cookie';

jest.mock('../../utils/burger-api', () => ({
  loginUserApi: jest.fn(() =>
    Promise.resolve({
      user: { email: 'test@test.ru', name: 'testName' },
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token'
    })
  ),
  registerUserApi: jest.fn(() =>
    Promise.resolve({
      refreshToken: 'test-refresh-token',
      accessToken: 'test-access-token',
      user: {
        email: 'test@test.ru',
        name: 'testName'
      }
    })
  ),
  logoutApi: jest.fn(() =>
    Promise.resolve({
      success: true
    })
  ),
  getUserApi: jest.fn(() =>
    Promise.resolve({
      user: { email: 'test@test.ru', name: 'testName' }
    })
  ),
  updateUserApi: jest.fn(() =>
    Promise.resolve({
      email: 'testNew@mail.ru',
      name: 'testNewName',
      password: 'testNewPass'
    })
  )
}));

jest.mock('../../utils/cookie');

// Мокируем localStorage!!!
global.localStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(() => null),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn((index) => null)
};

describe('тест authSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('[authSliceReducer / loginUser] тест успешной авторизации пользователя (fulfilled)', async () => {
    const mockUserAuthData = {
      email: 'test@test.ru',
      password: 'testPass'
    };

    const mockAuthResponse = {
      success: true,
      user: {
        email: 'test@test.ru',
        name: 'testName'
      },
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token'
    };

    const store = configureStore({ reducer: { user: reducer } });

    await store.dispatch(loginUser(mockUserAuthData));

    const state = store.getState().user;
    expect(state.isAuth).toBe(true);
    expect(state.user).toEqual(mockAuthResponse.user);
    expect(state.isAuthRequest).toBe(false);
    expect(state.isAuthCheked).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      'test-refresh-token'
    );
    expect(setCookie).toHaveBeenCalledWith('accessToken', 'test-access-token');
  });

  test('[authSliceReducer / loginUser] тест ожидания авторизации (pending)', async () => {
    const mockUserAuthData = {
      email: 'test@test.ru',
      password: 'testPass'
    };

    const store = configureStore({ reducer: { user: reducer } });

    const promise = store.dispatch(loginUser(mockUserAuthData));

    const state = store.getState().user;
    expect(state.error).toBe(undefined);
    expect(state.isAuthRequest).toBe(true);

    await promise;
  });

  test('[authSliceReducer / loginUser] тест неудачной авторизации пользователя (rejected)', async () => {
    const mockUserAuthData = {
      email: 'test@test.ru',
      password: 'wrongPass'
    };

    // Мокируем ошибку API
    jest
      .spyOn(require('../../utils/burger-api'), 'loginUserApi')
      .mockRejectedValueOnce(new Error('Неверный пароль'));

    const store = configureStore({ reducer: { user: reducer } });

    await store.dispatch(loginUser(mockUserAuthData));

    const state = store.getState().user;
    expect(state.isAuth).toBe(false);
    expect(state.user).toEqual({ name: '', email: '' });
    expect(state.isAuthRequest).toBe(false);
    expect(state.isAuthCheked).toBe(true);
    expect(state.error).toBe('Неверный пароль');
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(setCookie).not.toHaveBeenCalled();
  });

  test('[authSliceReducer / registerUser] тест успешной регистрации (fulfilled)', async () => {
    const mockRegUserData = {
      email: 'test@test.ru',
      name: 'testName',
      password: 'testPass'
    };

    const mockRegResponse = {
      success: true,
      user: {
        email: 'test@test.ru',
        name: 'testName'
      },
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token'
    };

    const store = configureStore({ reducer: { user: reducer } });
    await store.dispatch(registerUser(mockRegUserData));
    const state = store.getState().user;

    expect(state.user).toEqual(mockRegResponse.user);
    expect(state.isAuth).toBe(true);
  });

  test('[authSliceReducer / registerUser] тест ошибки при регистрации (fulfilled)', async () => {
    const mockRegUserData = {
      email: 'test@test.ru',
      name: 'testName',
      password: 'testPass'
    };

    // Мокируем ошибку API
    jest
      .spyOn(require('../../utils/burger-api'), 'registerUserApi')
      .mockRejectedValueOnce(new Error('Неверные данные'));

    const store = configureStore({ reducer: { user: reducer } });
    await store.dispatch(registerUser(mockRegUserData));
    const state = store.getState().user;

    expect(state.error).toBe('Неверные данные');
  });

  test('[authSliceReducer / logoutUser] тест логаута пользователя (fulfilled)', async () => {
    const store = configureStore({ reducer: { user: reducer } });
    await store.dispatch(logoutUser());
    const state = store.getState().user;

    expect(state.user).toEqual({ name: '', email: '' });
    expect(state.isAuth).toBe(false);
    expect(state.error).toBe(undefined);
    expect(localStorage.clear).toHaveBeenCalled();
    expect(deleteCookie).toHaveBeenCalledWith('accessToken');
  });

  test('[authSliceReducer / getUser] тест успешного получения пользователя (fulfilled)', async () => {
    const store = configureStore({ reducer: { user: reducer } });
    await store.dispatch(getUser());
    const state = store.getState().user;

    expect(state.user).toEqual({ email: 'test@test.ru', name: 'testName' });
    expect(state.isAuth).toBe(true);
    expect(state.isAuthCheked).toBe(true);
    expect(state.error).toBe(undefined);
  });

  test('[authSliceReducer / getUser] тест флага проверки авторизации при ошибке получения пользователя (rejected)', async () => {
    const store = configureStore({ reducer: { user: reducer } });

    // Мокируем ошибку API
    jest
      .spyOn(require('../../utils/burger-api'), 'getUserApi')
      .mockRejectedValueOnce(new Error('Ошибка'));

    await store.dispatch(getUser());
    const state = store.getState().user;

    expect(state.isAuthCheked).toBe(true);
  });

  test('[authSliceReducer / updateUserData] тест успешного изменения данных пользователя (fulfilled)', async () => {
    const initialState = {
      user: {
        user: {
          name: 'testName',
          email: 'test@test.ru'
        },
        isAuth: true,
        isAuthRequest: false,
        isAuthCheked: true,
        error: undefined
      }
    };

    const mockUpdateData = {
      name: 'testNewName',
      email: 'testNew@mail.ru',
      password: 'testNewPass'
    };

    const mockApiResponse = {
      user: {
        name: 'testNewName',
        email: 'testNew@mail.ru'
      }
    };

    // Мокаем updateUserApi
    jest
      .spyOn(require('../../utils/burger-api'), 'updateUserApi')
      .mockResolvedValueOnce(mockApiResponse);

    const store = configureStore({
      reducer: { user: reducer },
      preloadedState: initialState
    });
    await store.dispatch(updateUserData(mockUpdateData));
    const state = store.getState().user;

    expect(state.user).toEqual(mockApiResponse.user);
    expect(state.isAuthRequest).toBe(false);
    expect(state.isAuthCheked).toBe(true);
    expect(state.error).toBe(undefined);
  });

  test('[authSliceReducer / updateUserData] тест ожидания изменения данных пользователя (pending)', async () => {
    const initialState = {
      user: {
        user: {
          name: 'testName',
          email: 'test@test.ru'
        },
        isAuth: true,
        isAuthRequest: false,
        isAuthCheked: true,
        error: undefined
      }
    };

    const mockUpdateData = {
      name: 'testNewName',
      email: 'testNew@mail.ru',
      password: 'testNewPass'
    };

    const store = configureStore({
      reducer: { user: reducer },
      preloadedState: initialState
    });
    const promise = store.dispatch(updateUserData(mockUpdateData));
    const state = store.getState().user;

    expect(state.user).toEqual(initialState.user.user);
    expect(state.isAuthRequest).toBe(true);
    expect(state.isAuthCheked).toBe(true);
    expect(state.error).toBe(undefined);

    await promise;
  });

  test('[authSliceReducer / updateUserData] тест ошибки при изменении данных пользователя (rejected)', async () => {
    const initialState = {
      user: {
        user: {
          name: 'testName',
          email: 'test@test.ru'
        },
        isAuth: true,
        isAuthRequest: false,
        isAuthCheked: true,
        error: undefined
      }
    };

    const mockUpdateData = {
      name: 'testNewName',
      email: 'testNew@test.ru',
      password: 'testNewPass'
    };

    jest
      .spyOn(require('../../utils/burger-api'), 'updateUserApi')
      .mockRejectedValueOnce(new Error('Ошибка изменения данных'));

    const store = configureStore({
      reducer: { user: reducer },
      preloadedState: initialState
    });

    await store.dispatch(updateUserData(mockUpdateData));

    const state = store.getState().user;

    expect(state.user).toEqual(initialState.user.user);
    expect(state.isAuth).toBe(true);
    expect(state.isAuthRequest).toBe(false);
    expect(state.isAuthCheked).toBe(true);
  });
});
