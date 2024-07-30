import { expect, test, describe, jest } from '@jest/globals';
import reducer, { TInitialState } from './slice';
import { getIngredients } from './action';

describe('тест ingredientsSlice', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  const initialState: TInitialState = {
    ingredients: [],
    isIngredientsLoading: false,
    error: undefined
  };

  test('[ingredientsSliceReducer] тест флага загрузки (pending)', async () => {
    const newState = reducer(initialState, getIngredients.pending(''));
    expect(newState).toEqual({ ...initialState, isIngredientsLoading: true });
  });

  test('[ingredientsSliceReducer] тест успешной загрузки и сохранения ингридиентов (fulfilled)', async () => {
    const mockIngredients = [
      {
        _id: '1',
        name: 'TestIngredient',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ];
    const newState = reducer(
      { ...initialState, isIngredientsLoading: true },
      getIngredients.fulfilled(mockIngredients, '')
    );
    expect(newState).toEqual({
      ...initialState,
      ingredients: mockIngredients,
      isIngredientsLoading: false
    });
  });

  test('[ingredientsSliceReducer] тест ошибки загрузки ингредиентов (reject)', async () => {
    const newState = reducer(
      initialState,
      getIngredients.rejected(new Error('Ошибка загрузки'), '')
    );
    expect(newState).toEqual({ ...initialState, error: 'Ошибка загрузки' });
  });
});
