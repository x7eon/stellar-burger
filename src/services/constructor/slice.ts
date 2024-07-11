import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../store';

type TInitialState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TInitialState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } };
      }
    },
    delIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    resetConstructor: (state) => {
      state.ingredients = [];
      state.bun = null;
    }
  }
});

export const { addBun, addIngredient, delIngredient, resetConstructor } =
  constructorSlice.actions;
export const getConstructorIngredients = (state: RootState) =>
  state.constructorIngredients;
export default constructorSlice.reducer;
