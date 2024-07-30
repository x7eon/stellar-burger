import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredients } from './action';
import { RootState } from '../store';

export type TInitialState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | undefined;
};

const initialState: TInitialState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: undefined
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = undefined;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const getIngredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;
export const getIsIngredientsLoadingSelector = (state: RootState) =>
  state.ingredients.isIngredientsLoading;
export const getErrorSelector = (state: RootState) => state.ingredients.error;

export default ingredientsSlice.reducer;
