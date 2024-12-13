import { createSlice } from '@reduxjs/toolkit';

const usuarioSlice = createSlice({
	name: 'usuario',
	initialState: {
		isLoggedIn: false,
		userInfo: null,
	},
	reducers: {
		login: (state, action) => {
			state.isLoggedIn = true;
			state.userInfo = action.payload;
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.userInfo = null;
		},
		addUsuario: (state, action) => {
			state.push(action.payload);
		},
		updateUsuario: (state, action) => {
			const index = state.findIndex((usuario) => usuario.id === action.payload.id);
			if (index !== -1) {
				state[index] = action.payload;
			}
		},
		deleteUsuario: (state, action) => {
			return state.filter((usuario) => usuario.id !== action.payload);
		},
	},
});

export const { login, logout, addUsuario, updateUsuario, deleteUsuario } = usuarioSlice.actions;
export default usuarioSlice.reducer;
