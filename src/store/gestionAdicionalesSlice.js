import { createSlice } from '@reduxjs/toolkit';

export const gestionAdicionalesSlice = createSlice({
	name: 'gestionAdicionales',
	initialState: [],
	reducers: {
		setGestionAdicionales: (state, action) => {
			return action.payload;
		}
	},
});

export const { setGestionAdicionales } = gestionAdicionalesSlice.actions;

export default gestionAdicionalesSlice.reducer;
