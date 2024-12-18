import { createSlice } from '@reduxjs/toolkit';

export const gestionPermisosSlice = createSlice({
  name: 'gestionPermisos',
  initialState: [],  
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

export const { setPermisos, addPermiso, updatePermiso, deletePermiso } = gestionPermisosSlice.actions;

export default gestionPermisosSlice.reducer;
