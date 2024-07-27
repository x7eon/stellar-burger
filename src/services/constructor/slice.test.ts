import { expect, test, describe, jest } from '@jest/globals';
import {
  addBun,
  addIngredient,
  delIngredient,
  moveIngredient,
  TInitialState
} from './slice';
import reducer from './slice';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid')
}));

describe('тест constructorSlice', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    initialState = {
      bun: null,
      ingredients: []
    };
  });

  let initialState: TInitialState = {
    bun: null,
    ingredients: []
  };

  test('[constructorSliceReducer / addBun] тест добавления булочки', () => {
    const mockIngredientBun = {
      _id: '1',
      name: 'FakeBun',
      type: 'string',
      proteins: 5,
      fat: 50,
      carbohydrates: 332,
      calories: 556,
      price: 280,
      image: 'string',
      image_large: 'string',
      image_mobile: 'string'
    };

    const newState = reducer(initialState, addBun(mockIngredientBun));
    expect(newState).toEqual({ ...initialState, bun: mockIngredientBun });
  });

  test('[constructorSliceReducer / addIngredient] тест добавления ингредиента', () => {
    const mockIngredient = {
      _id: '1',
      name: 'FakeIngredient',
      type: 'string',
      proteins: 22,
      fat: 70,
      carbohydrates: 3,
      calories: 15,
      price: 125,
      image: 'string',
      image_large: 'string',
      image_mobile: 'string'
    };

    const newState = reducer(initialState, addIngredient(mockIngredient));
    expect(newState).toEqual({
      ...initialState,
      ingredients: [{ ...mockIngredient, id: 'mock-uuid' }]
    });
  });

  test('[constructorSliceReducer / delIngredient] тест удаления ингредиента', () => {
    const fakeId = uuidv4();
    const mockState = {
      bun: null,
      ingredients: [
        {
          _id: '1',
          name: 'FakeIngredient',
          type: 'string',
          proteins: 22,
          fat: 70,
          carbohydrates: 3,
          calories: 15,
          price: 125,
          image: 'string',
          image_large: 'string',
          image_mobile: 'string',
          id: fakeId
        }
      ]
    };

    const newState = reducer(mockState, delIngredient(fakeId));
    expect(newState).toEqual(initialState);
  });

  test('[constructorSliceReducer / moveIngredient] тест изменения порядка ингредиентов(вверх)', () => {
    const fakeId = uuidv4();
    const mockState = {
      bun: null,
      ingredients: [
        {
          _id: '1',
          name: 'FakeIngredient_1',
          type: 'string',
          proteins: 22,
          fat: 70,
          carbohydrates: 3,
          calories: 15,
          price: 125,
          image: 'string',
          image_large: 'string',
          image_mobile: 'string',
          id: fakeId
        },
        {
          _id: '2',
          name: 'FakeIngredient_2',
          type: 'string',
          proteins: 11,
          fat: 9,
          carbohydrates: 23,
          calories: 90,
          price: 800,
          image: 'string',
          image_large: 'string',
          image_mobile: 'string',
          id: fakeId
        }
      ]
    };

    const newState = reducer(
      mockState,
      moveIngredient({ index: 1, direction: 'up' })
    );
    expect(newState.ingredients).toEqual([
      mockState.ingredients[1],
      mockState.ingredients[0]
    ]);
  });

  test('[constructorSliceReducer / moveIngredient] тест изменения порядка ингредиентов(вниз)', () => {
    const fakeId = uuidv4();
    const mockState = {
      bun: null,
      ingredients: [
        {
          _id: '1',
          name: 'FakeIngredient_1',
          type: 'string',
          proteins: 22,
          fat: 70,
          carbohydrates: 3,
          calories: 15,
          price: 125,
          image: 'string',
          image_large: 'string',
          image_mobile: 'string',
          id: fakeId
        },
        {
          _id: '2',
          name: 'FakeIngredient_2',
          type: 'string',
          proteins: 11,
          fat: 9,
          carbohydrates: 23,
          calories: 90,
          price: 800,
          image: 'string',
          image_large: 'string',
          image_mobile: 'string',
          id: fakeId
        }
      ]
    };

    const newState = reducer(
      mockState,
      moveIngredient({ index: 0, direction: 'down' })
    );
    expect(newState.ingredients).toEqual([
      mockState.ingredients[1],
      mockState.ingredients[0]
    ]);
  });

  test('[constructorSliceReducer / moveIngredient] тест перемещения последнего ингредиента вниз - НЕ должен переместиться', () => {
    const fakeId = uuidv4();
    const mockState = {
      bun: null,
      ingredients: [
        {
          _id: '1',
          name: 'FakeIngredient_1',
          type: 'string',
          proteins: 22,
          fat: 70,
          carbohydrates: 3,
          calories: 15,
          price: 125,
          image: 'string',
          image_large: 'string',
          image_mobile: 'string',
          id: fakeId
        },
        {
          _id: '2',
          name: 'FakeIngredient_2',
          type: 'string',
          proteins: 11,
          fat: 9,
          carbohydrates: 23,
          calories: 90,
          price: 800,
          image: 'string',
          image_large: 'string',
          image_mobile: 'string',
          id: fakeId
        }
      ]
    };

    const newState = reducer(
      mockState,
      moveIngredient({ index: 1, direction: 'down' })
    );
    expect(newState.ingredients).toEqual([
      mockState.ingredients[0],
      mockState.ingredients[1]
    ]);
  });

  test('[constructorSliceReducer / moveIngredient] тест перемещения первого ингредиента вверх - НЕ должен переместиться', () => {
    const fakeId = uuidv4();
    const mockState = {
      bun: null,
      ingredients: [
        {
          _id: '1',
          name: 'FakeIngredient_1',
          type: 'string',
          proteins: 22,
          fat: 70,
          carbohydrates: 3,
          calories: 15,
          price: 125,
          image: 'string',
          image_large: 'string',
          image_mobile: 'string',
          id: fakeId
        },
        {
          _id: '2',
          name: 'FakeIngredient_2',
          type: 'string',
          proteins: 11,
          fat: 9,
          carbohydrates: 23,
          calories: 90,
          price: 800,
          image: 'string',
          image_large: 'string',
          image_mobile: 'string',
          id: fakeId
        }
      ]
    };

    const newState = reducer(
      mockState,
      moveIngredient({ index: 0, direction: 'up' })
    );
    expect(newState.ingredients).toEqual([
      mockState.ingredients[0],
      mockState.ingredients[1]
    ]);
  });
});
