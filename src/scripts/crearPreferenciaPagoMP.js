import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const crearPreferencia = async (pedidoId, direccionId, fechaFormateada, deliveryMethod, token) => {
	const BASE_URL = process.env.REACT_APP_URL || 'http://localhost:3000';

	const body = {
		pedido_id: pedidoId,
		direccion_id: direccionId,
		fecha_envio: fechaFormateada,
		delivery_method: deliveryMethod,
		backUrls: {
			success: `${BASE_URL}/carrito`,
			pending: `${BASE_URL}/carrito`,
			failure: `${BASE_URL}/carrito`,
		},
	};
	try {
		const response = await apiClient.post('/pagos/crearPreferencia', body, {
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
			} else {
				const errorData = error.response.data;
				throw new Error(errorData.error || 'Se produjo un error desconocido.');
			}
		} else if (error.request) {
			throw new Error('No se pudo establecer conexión con el servidor.');
		} else {
			throw new Error('Error al realizar la solicitud.');
		}
	}
};
