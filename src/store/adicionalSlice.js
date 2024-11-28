// src/redux/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';

export const adicionalSlice = createSlice({
  name: 'adicionales',
  initialState: [],  
  reducers: {
    setAdicionales: (state, action) => {
      return action.payload;
    },
    addAdicional: (state, action) => {
      state.push(action.payload);
    },
    updateAdicional: (state, action) => {
      const index = state.findIndex((adicional) => adicional.id === adicional.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteAdicional: (state, action) => {
      return state.filter((adicional) => adicional.id !== adicional.payload);
    },
  },
});

export const { setAdicionales, addAdicional, updateAdicional, deleteAdicional } = adicionalSlice.actions;

export default adicionalSlice.reducer;
