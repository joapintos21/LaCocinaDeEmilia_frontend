import { createSlice } from '@reduxjs/toolkit';

const productoSlice = createSlice({
	name: 'productos',
	initialState: [],
	reducers: {
		setProductos: (state, action) => {
			return action.payload.map((producto) => ({
				...producto,
				imageSrc: producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : null,
			}));
		},
		addProduct: (state, action) => {
			const producto = action.payload;
			producto.imageSrc = producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : null;
			state.push(producto);
		},
		updateProduct: (state, action) => {
			const index = state.findIndex((product) => product.id === action.payload.id);
			if (index !== -1) {
				state[index] = {
					...action.payload,
					imageSrc: action.payload.imagen ? `data:image/jpeg;base64,${action.payload.imagen}` : null,
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
