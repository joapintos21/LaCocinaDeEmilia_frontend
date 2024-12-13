// productoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const productoSlice = createSlice({
	name: 'productos',
	initialState: [],
	reducers: {
		setProductos: (state, action) => {
			return action.payload;
		},
		addProduct: (state, action) => {
			state.push(action.payload);
		},
		updateProduct: (state, action) => {
			const index = state.findIndex((product) => product.id === action.payload.id);
			if (index !== -1) {
				state[index] = action.payload;
			}
		},
		deleteProduct: (state, action) => {
			// Asegúrate de que 'productos' siempre sea un array, incluso si está vacío o es undefined
			state = state ? state.filter((product) => product.id !== action.payload) : [];
		},
	},
});

export const { setProductos, addProduct, updateProduct, deleteProduct } = productoSlice.actions;

export default productoSlice.reducer;
