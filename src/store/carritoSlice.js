import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	items: [],
	cantidadProductos: 0,
	precioTotal: 0,
	costoEnvio: 0,
	comisionMP: 0,
	direccionId: 0,
	pedidoId: '',
	deliveryMethod: '',
	notas: '',
	cupon: '',
};

const carritoSlice = createSlice({
	name: 'carrito',
	initialState,
	reducers: {
		agregarItem: (state, action) => {
			const newItem = action.payload;
			const existingItem = state.items.find(
				(item) =>
					item.id === newItem.id &&
					item.adicional?.id === newItem.adicional?.id &&
					item.tipo === newItem.tipo,
			);

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
					precioTotal: (newItem.precio + (newItem.adicional?.costoAdicional || 0)) * (newItem.cantidad || 1),
					adicional: newItem.adicional,
					imageSrc: newItem.imagen ? `data:image/jpeg;base64,${newItem.imagen}` : null,
				});
			}
			state.cantidadProductos += newItem.cantidad || 1;
			state.precioTotal += (newItem.precio + (newItem.adicional?.costoAdicional || 0)) * (newItem.cantidad || 1);
			state.pedidoId = newItem.pedido_id;
		},

		quitarItem: (state, action) => {
			const { id, tipo, adicional, cantidad = 1 } = action.payload;

			// Buscar el índice del producto-adicional en el carrito
			const existingItemIndex = state.items.findIndex(
				(item) =>
					item.id === id &&
					item.tipo === tipo &&
					(adicional
						? item.adicional?.id === adicional.id // Verificar adicional coincidente
						: !item.adicional), // Buscar productos sin adicional si adicional es null
			);

			if (existingItemIndex !== -1) {
				const existingItem = state.items[existingItemIndex];

				if (existingItem.cantidad > cantidad) {
					// Reducir cantidad del producto-adicional
					existingItem.cantidad -= cantidad;
					existingItem.precioTotal -=
						(existingItem.precio + (existingItem.adicional?.costoAdicional || 0)) * cantidad;

					// Ajustar los totales
					state.cantidadProductos -= cantidad;
					state.precioTotal -=
						(existingItem.precio + (existingItem.adicional?.costoAdicional || 0)) * cantidad;
				} else {
					// Eliminar el producto-adicional del carrito
					state.cantidadProductos -= existingItem.cantidad;
					state.precioTotal -= existingItem.precioTotal;
					state.items.splice(existingItemIndex, 1);
				}
			}

			// Si el carrito queda vacío, limpiar pedidoId y direccionId
			if (state.cantidadProductos < 1) {
				state.pedidoId = '';
				state.direccionId = 0;
			}
		},

		incrementarCantidad: (state, action) => {
			const { id, tipo, adicional } = action.payload;

			const existingItem = state.items.find(
				(item) =>
					item.id === id &&
					item.tipo === tipo &&
					(adicional ? item.adicional?.id === adicional.id : !item.adicional),
			);

			if (existingItem) {
				existingItem.cantidad += 1;
				existingItem.precioTotal += existingItem.precio + (existingItem.adicional?.costoAdicional || 0);
				state.cantidadProductos += 1;
				state.precioTotal += existingItem.precio + (existingItem.adicional?.costoAdicional || 0);
			}
		},

		decrementarCantidad: (state, action) => {
			const { id, tipo, adicional } = action.payload;

			const existingItem = state.items.find(
				(item) =>
					item.id === id &&
					item.tipo === tipo &&
					(adicional ? item.adicional?.id === adicional.id : !item.adicional),
			);

			if (existingItem) {
				if (existingItem.cantidad > 1) {
					existingItem.cantidad -= 1;
					existingItem.precioTotal -= existingItem.precio + (existingItem.adicional?.costoAdicional || 0);
					state.cantidadProductos -= 1;
					state.precioTotal -= existingItem.precio + (existingItem.adicional?.costoAdicional || 0);
				} else {
					// Si la cantidad es 1, elimina el producto-adicional
					state.items = state.items.filter(
						(item) =>
							!(
								item.id === id &&
								item.tipo === tipo &&
								(adicional ? item.adicional?.id === adicional.id : !item.adicional)
							),
					);
					state.cantidadProductos -= 1;
					state.precioTotal -= existingItem.precio + (existingItem.adicional?.costoAdicional || 0);
				}
			}

			if (state.cantidadProductos < 1) {
				state.pedidoId = '';
				state.direccionId = 0;
			}
		},

		limpiarCarrito: (state) => {
			state.items = [];
			state.cantidadProductos = 0;
			state.precioTotal = 0;
			state.costoEnvio = 0;
			state.pedidoId = '';
			state.direccionId = 0;
			state.notas = '';
			state.cupon = '';
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
					precioTotal: (producto.precio + (producto.adicional?.costoAdicional || 0)) * producto.cantidad,
					adicional: producto.adicional,
					imageSrc: producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : null,
				})),
				...packs.map((pack) => ({
					id: pack.id,
					descripcion: pack.nombre,
					tipo: 'pack', // Identifica como pack
					precio: pack.precio,
					cantidad: pack.cantidad,
					precioTotal: pack.precio * pack.cantidad,
					imageSrc: pack.imagen ? `data:image/jpeg;base64,${pack.imagen}` : null,
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

		setDeliveryMethod: (state, action) => {
			state.deliveryMethod = action.payload;
		},

		setNotas: (state, action) => {
			state.notas = action.payload;
		},
		setCupon: (state, action) => {
			state.cupon = action.payload;
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
	setDeliveryMethod,
	setNotas,
	setCupon,
} = carritoSlice.actions;

export default carritoSlice.reducer;
