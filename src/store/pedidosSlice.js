import { createSlice } from '@reduxjs/toolkit';

const pedidosSlice = createSlice({
	name: 'pedidos',
	initialState: [],
	reducers: {
		setPedidos: (state, action) => {
			return action.payload;
		},
		addPedido: (state, action) => {
			state.push(action.payload);
		},
		updatePedido: (state, action) => {
			const index = state.findIndex((pedido) => pedido.id === action.payload.id);
			if (index !== -1) {
				state[index] = action.payload;
			}
		},
		deletePedido: (state, action) => {
			return state.filter((pedido) => pedido.id !== action.payload);
		},
	},
});

export const { setPedidos, addPedido, updatePedido, deletePedido } = pedidosSlice.actions;
export default pedidosSlice.reducer;
