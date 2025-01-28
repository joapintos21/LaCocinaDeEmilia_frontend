import { createSlice } from '@reduxjs/toolkit';

export const rolesUsuarioSlice = createSlice({
  name: 'rolesUsuario',
  initialState: [],  
  reducers: {
    setRolesUsuario: (state, action) => {
      return action.payload;
    }
  },
});

export const { setRolesUsuario } = rolesUsuarioSlice.actions;

export default rolesUsuarioSlice.reducer;
