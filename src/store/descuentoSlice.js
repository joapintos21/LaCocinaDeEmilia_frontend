// src/redux/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';

export const descuentoSlice = createSlice({
	name: 'discount',
	initialState: [], // Asegúrate de que el estado inicial sea un arreglo vacío
	reducers: {
		setDescuentos: (state, action) => {
			return action.payload;
		},
		addDescuento: (state, action) => {
			state.push(action.payload);
		},
		updateDescuento: (state, action) => {
			const index = state.findIndex((descuento) => descuento.id === action.payload.id);
			if (index !== -1) {
				state[index] = action.payload;
			}
		},
		deleteDescuento: (state, action) => {
			return state.filter((descuento) => descuento.id !== action.payload);
		},
	},
});

export const { setDescuentos, addDescuento, updateDescuento, deleteDescuento } = descuentoSlice.actions;

export default descuentoSlice.reducer;
