import { createSlice } from '@reduxjs/toolkit';

export const empresaSlice = createSlice({
	name: 'empresa',
	initialState: [], 
	reducers: {
		setEmpresa: (state, action) => {
			return action.payload;
		}
	},
});

export const { setEmpresa } = empresaSlice.actions;

export default empresaSlice.reducer;
