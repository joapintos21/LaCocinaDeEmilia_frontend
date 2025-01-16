// Ruta: src/scripts/agregarProductoCarrito.js
import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente'; // Asegúrate de que la ruta sea correcta

export const agregarProductoACarrito = async (clienteId, productoId, cantidad, selectedAdicional, token) => {
	// if (!clienteId) {
	// 	throw new Error('Debe iniciar sesión para poder agregar productos.');
	// }

	const body = {
		userId: clienteId,
		productoId: productoId,
		cantidad: cantidad,
		adicionalId: selectedAdicional,
	};

	try {
		// Realiza la solicitud POST usando el apiCliente
		const response = await apiClient.post('/carrito/agregarProductoACarrito', body, {
			headers: {
				Authorization: `Bearer ${token}`, // Incluir el token en el header de autorización
			},
		});

		// Devuelve los datos de la respuesta
		return response.data;
	} catch (error) {
		// Manejo de errores
		if (error.response) {
			if (error.response.status === 401) {
				toast.info('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', {
					onClose: () => {
						window.location.href = '/login';
					},
				});
			}
			const errorData = error.response.data;
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		} else if (error.request) {
			throw new Error('No se pudo establecer conexión con el servidor.');
		} else {
			throw new Error('Error al realizar la solicitud.');
		}
	}
};
