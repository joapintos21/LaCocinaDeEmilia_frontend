import { createSlice } from '@reduxjs/toolkit';

export const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState: [],
	reducers: {
		setDashboard: (state, action) => {
			return action.payload;
		},
	},
});

export const { setDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
