import { createSlice } from '@reduxjs/toolkit';

export const cuponSlice = createSlice({
	name: 'cupon',
	initialState: [],
	reducers: {
		setCupones: (state, action) => {
			return action.payload;
		},
		addCupon: (state, action) => {
			state.push(action.payload);
		},
		updateCupon: (state, action) => {
			const index = state.findIndex((cupon) => cupon.id === action.payload.id);
			if (index !== -1) {
				state[index] = action.payload;
			}
		},
		deleteCupon: (state, action) => {
			return state.filter((cupon) => cupon.id !== action.payload);
		},
	},
});

export const { setCupones, addCupon, updateCupon, deleteCupon } = cuponSlice.actions;

export default cuponSlice.reducer;
