import { createSlice } from '@reduxjs/toolkit';

export const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState: [],  
  reducers: {
    setUsuarios: (state, action) => {
      return action.payload;
    },
    addUsuario: (state, action) => {
      state.push(action.payload);
    },
    updateUsuario: (state, action) => {
      const index = state.findIndex((usuarios) => usuarios.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteUsuario: (state, action) => {
      return state.filter((usuarios) => usuarios.id !== action.payload);
    },
  },
});

export const { setUsuarios, addUsuario, updateUsuario, deleteUsuario } = usuariosSlice.actions;

export default usuariosSlice.reducer;
