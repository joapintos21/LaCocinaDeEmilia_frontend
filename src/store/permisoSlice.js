// src/redux/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';

export const permisoSlice = createSlice({
  name: 'permissions',
  initialState: [],  // Asegúrate de que el estado inicial sea un arreglo vacío
  reducers: {
    setPermisos: (state, action) => {
      return action.payload;
    },
    addPermiso: (state, action) => {
      state.push(action.payload);
    },
    updatePermiso: (state, action) => {
      const index = state.findIndex((permiso) => permiso.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deletePermiso: (state, action) => {
      return state.filter((permiso) => permiso.id !== action.payload);
    },
  },
});

export const { setPermisos, addPermiso, updatePermiso, deletePermiso } = permisoSlice.actions;

export default permisoSlice.reducer;
