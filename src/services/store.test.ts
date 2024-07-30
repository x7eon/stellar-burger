import { expect, test, describe, jest } from '@jest/globals';
import ingredientsReducer from './ingredients/slice';
import constructorIngredientsReducer from './constructor/slice';
import userReducer from './auth/slice';
import orderReducer from './orders/slice';
import { rootReducer } from './store';

describe('[rootReducer] тест корректной настройки и работы корневого редьюсера', () => {
  test('тест передача неизвестного состояния, возвращается корректное начальное состояние', () => {
    const initAction = { type: 'INIT' };
    const initialState = rootReducer(undefined, initAction);

    expect(initialState).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      constructorIngredients: constructorIngredientsReducer(
        undefined,
        initAction
      ),
      user: userReducer(undefined, initAction),
      order: orderReducer(undefined, initAction)
    });
  });

  test('тест передача неизвестного экшена, возвращается корректное начальное состояние', () => {
    const initialState = rootReducer(undefined, { type: 'INIT' });
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const newState = rootReducer(initialState, unknownAction);

    expect(newState).toEqual(initialState);
  });
});
