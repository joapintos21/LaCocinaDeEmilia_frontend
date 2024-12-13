import { agregarPackACarrito } from 'scripts/agregarPackCarrito';
import { agregarProductoACarrito } from 'scripts/agregarProductoCarrito';
import { quitarPackCarrito } from 'scripts/quitarPackCarrito';
import { quitarProductoCarrito } from 'scripts/quitarProductoCarrito';
import { agregarItem } from 'store/carritoSlice';

/**
 * Agregar un producto al carrito
 */
export const handleAddToCart = async (producto, cantidad, token, clienteId, tipo, dispatch) => {
	let response;

	if (tipo === 'producto') {
		response = await agregarProductoACarrito(clienteId, producto.id, cantidad, token);
	} else {
		response = await agregarPackACarrito(clienteId, producto.id, cantidad, token);
	}

	// Verificar que la respuesta contiene el pedido_id
	const pedidoId = response?.pedido_id;

	// Crear el objeto con la información del producto y el pedido_id
	const productoConCantidad = { ...producto, cantidad, tipo, pedido_id: pedidoId };

	dispatch(agregarItem(productoConCantidad));
};

/**
 * Quitar un producto del carrito
 */
export const handleQuitarDeCarrito = async (userId, productoId, cantidad, tipo, token) => {
	try {
		if (tipo === 'producto') {
			await quitarProductoCarrito(userId, productoId, cantidad, token);
		} else {
			await quitarPackCarrito(userId, productoId, cantidad, token);
		}
	} catch (error) {
		alert('Error al quitar producto del carrito');
	}
};
