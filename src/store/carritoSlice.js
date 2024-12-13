import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	items: [],
	cantidadProductos: 0,
	precioTotal: 0,
	costoEnvio: 0,
	comisionMP: 0,
	direccionId: '',
	pedidoId: '',
};

const carritoSlice = createSlice({
	name: 'carrito',
	initialState,
	reducers: {
		agregarItem: (state, action) => {
			const newItem = action.payload;
			const existingItem = state.items.find((item) => item.id === newItem.id && item.tipo === newItem.tipo);

			if (existingItem) {
				existingItem.cantidad += newItem.cantidad || 1; // Incrementa la cantidad
				existingItem.precioTotal += newItem.precio * (newItem.cantidad || 1);
			} else {
				state.items.push({
					id: newItem.id,
					descripcion: newItem.descripcion,
					tipo: newItem.tipo, // "producto" o "pack"
					precio: newItem.precio,
					cantidad: newItem.cantidad || 1,
					precioTotal: newItem.precio * (newItem.cantidad || 1),
				});
			}
			state.cantidadProductos += newItem.cantidad || 1;
			state.precioTotal += newItem.precio * (newItem.cantidad || 1);
			state.pedidoId = newItem.pedido_id;
		},

		quitarItem: (state, action) => {
			const { id, tipo } = action.payload;

			const existingItemIndex = state.items.findIndex((item) => item.id === id && item.tipo === tipo);

			if (existingItemIndex !== -1) {
				const existingItem = state.items[existingItemIndex];

				state.cantidadProductos -= existingItem.cantidad;
				state.precioTotal -= existingItem.precioTotal;

				state.items.splice(existingItemIndex, 1);
			}
			if (state.cantidadProductos < 1) {
				state.pedidoId = '';
				state.direccionId = '';
			}
		},

		incrementarCantidad: (state, action) => {
			const { id, tipo } = action.payload;

			const existingItem = state.items.find((item) => item.id === id && item.tipo === tipo);

			if (existingItem) {
				existingItem.cantidad += 1;
				existingItem.precioTotal += existingItem.precio;
				state.cantidadProductos += 1;
				state.precioTotal += existingItem.precio;
			}
		},

		decrementarCantidad: (state, action) => {
			const { id, tipo } = action.payload;

			const existingItem = state.items.find((item) => item.id === id && item.tipo === tipo);

			if (existingItem) {
				if (existingItem.cantidad > 1) {
					existingItem.cantidad -= 1;
					existingItem.precioTotal -= existingItem.precio;
					state.cantidadProductos -= 1;
					state.precioTotal -= existingItem.precio;
				} else {
					// Si la cantidad es 1, elimina el producto o pack
					state.items = state.items.filter((item) => item.id !== id || item.tipo !== tipo);
					state.cantidadProductos -= 1;
					state.precioTotal -= existingItem.precio;
				}
			}
			if (state.cantidadProductos < 1) {
				state.pedidoId = '';
				state.direccionId = '';
			}
		},

		limpiarCarrito: (state) => {
			state.items = [];
			state.cantidadProductos = 0;
			state.precioTotal = 0;
			state.costoEnvio = 0;
			state.pedidoId = '';
			state.direccionId = '';
		},

		setCostoEnvio: (state, action) => {
			state.costoEnvio = action.payload;
		},

		setComisionMP: (state, action) => {
			state.comisionMP = action.payload;
		},

		setCarrito: (state, action) => {
			// Transforma los datos del backend al formato esperado por el estado del carrito
			const { productos, packs, total, id } = action.payload;

			const items = [
				...productos.map((producto) => ({
					id: producto.id,
					descripcion: producto.descripcion,
					tipo: 'producto', // Identifica como producto
					precio: producto.precio,
					cantidad: producto.cantidad,
					precioTotal: producto.precio * producto.cantidad,
				})),
				...packs.map((pack) => ({
					id: pack.id,
					descripcion: pack.nombre,
					tipo: 'pack', // Identifica como pack
					precio: pack.precio,
					cantidad: pack.cantidad,
					precioTotal: pack.precio * pack.cantidad,
				})),
			];

			state.items = items;
			state.cantidadProductos = items.reduce((total, item) => total + item.cantidad, 0);
			state.precioTotal = total;
			state.pedidoId = id;
		},

		setDireccion: (state, action) => {
			state.direccionId = action.payload;
		},
	},
});

export const {
	agregarItem,
	quitarItem,
	incrementarCantidad,
	decrementarCantidad,
	limpiarCarrito,
	setCarrito,
	setCostoEnvio,
	setComisionMP,
	setDireccion,
} = carritoSlice.actions;

export default carritoSlice.reducer;
