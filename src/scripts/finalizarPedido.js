import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const finalizarPedido = async (
	pedidoId,
	metodoPagoId,
	paymentId,
	direccionId,
	fechaEnvio,
	deliveryMethod,
	notas,
	token,
) => {
	const body = {
		pedido_id: pedidoId,
		metodo_pago_id: metodoPagoId,
		payment_id: paymentId,
		direccion_id: direccionId,
		fecha_envio: fechaEnvio,
		delivery_method: deliveryMethod,
		notas: notas,
	};

	try {
		const response = await apiClient.put('/pedidos/finalizarPedido', body, {
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
