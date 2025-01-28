import { createSlice } from '@reduxjs/toolkit';

const productoSlice = createSlice({
	name: 'productos',
	initialState: [],
	reducers: {
		setProductos: (state, action) => {
			return action.payload.map((producto) => ({
				...producto,
				imagen: producto.imagen || null, // Guardamos solo la URL
			}));
		},
		addProduct: (state, action) => {
			const producto = action.payload;
			producto.imagen = producto.imagen || null; // Guardamos solo la URL de Firebase
			state.push(producto);
		},
		updateProduct: (state, action) => {
			const index = state.findIndex((product) => product.id === action.payload.id);
			if (index !== -1) {
				state[index] = {
					...action.payload,
					imagen: action.payload.imagen || null, // Usamos la URL en lugar de Base64
				};
			}
		},
		deleteProduct: (state, action) => {
			return state.filter((product) => product.id !== action.payload);
		},
	},
});

export const { setProductos, addProduct, updateProduct, deleteProduct } = productoSlice.actions;
export default productoSlice.reducer;
