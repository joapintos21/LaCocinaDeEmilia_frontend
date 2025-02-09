import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';
import { setCupones } from 'store/cuponSlice';

export const obtenerCupones = async (dispatch, token) => {
	try {
		const response = await apiClient.get('/cupones', {
			headers: { Authorization: `Bearer ${token}` },
		});

		dispatch(setCupones(response.data));
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
