import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const actualizarCupon = async (id, tipoId, valor, fechaInicio, fechaFin, codigo, token) => {
	const body = {
		tipo_id: parseInt(tipoId),
		valor: parseFloat(valor),
		fechainicio: fechaInicio,
		fechafin: fechaFin,
		codigo: codigo,
	};

	try {
		const response = await apiClient.put(`/cupones/update/${id}`, body, {
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
