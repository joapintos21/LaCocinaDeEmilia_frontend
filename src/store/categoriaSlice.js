// src/redux/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';

export const categorySlice = createSlice({
  name: 'categories',
  initialState: [],  // Asegúrate de que el estado inicial sea un arreglo vacío
  reducers: {
    setCategorias: (state, action) => {
      return action.payload;
    },
    addCategory: (state, action) => {
      state.push(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.findIndex((category) => category.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteCategory: (state, action) => {
      return state.filter((category) => category.id !== action.payload);
    },
  },
});

export const { setCategorias, addCategory, updateCategory, deleteCategory } = categorySlice.actions;

export default categorySlice.reducer;
