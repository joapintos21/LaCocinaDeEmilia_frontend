import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const agregarProductoACarrito = async (clienteId, productoId, cantidad, selectedAdicional, token) => {
	const body = {
		userId: clienteId,
		productoId: productoId,
		cantidad: cantidad,
		adicionalId: selectedAdicional,
	};

	try {
		const response = await apiClient.post('/carrito/agregarProductoACarrito', body, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	} catch (error) {
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
