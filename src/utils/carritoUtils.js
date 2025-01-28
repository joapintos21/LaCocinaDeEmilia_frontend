import { agregarPackACarrito } from 'scripts/agregarPackCarrito';
import { agregarProductoACarrito } from 'scripts/agregarProductoCarrito';
import { quitarPackCarrito } from 'scripts/quitarPackCarrito';
import { quitarProductoCarrito } from 'scripts/quitarProductoCarrito';
import { agregarItem } from 'store/carritoSlice';

/**
 * Agregar un producto al carrito
 */
export const handleAddToCart = async (producto, cantidad, selectedAdicional, token, clienteId, tipo, dispatch) => {
	let response;
	let adicional = producto.adicional;
	if (!adicional) {
		adicional = selectedAdicional
			? producto.adicionales.filter((adicional) => adicional.id === parseInt(selectedAdicional))[0]
			: null;
	}

	if (tipo === 'producto') {
		response = await agregarProductoACarrito(clienteId, producto.id, cantidad, adicional?.id, token);
	} else {
		response = await agregarPackACarrito(clienteId, producto.id, cantidad, token);
	}

	// Verificar que la respuesta contiene el pedido_id
	const pedidoId = response?.pedido_id;

	// Crear el objeto con la información del producto y el pedido_id
	const productoConCantidad = { ...producto, cantidad, tipo, pedido_id: pedidoId, adicional };

	dispatch(agregarItem(productoConCantidad));
};

/**
 * Quitar un producto del carrito
 */
export const handleQuitarDeCarrito = async (userId, productoId, cantidad, tipo, adicionalId, token) => {
	try {
		if (tipo === 'producto') {
			await quitarProductoCarrito(userId, productoId, cantidad, adicionalId, token);
		} else {
			await quitarPackCarrito(userId, productoId, cantidad, token);
		}
	} catch (error) {
		alert('Error al quitar producto del carrito');
	}
};
