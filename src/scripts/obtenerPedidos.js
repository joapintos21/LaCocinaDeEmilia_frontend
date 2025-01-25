import { setPedidos } from '../store/pedidosSlice';

export const obtenerPedidos = async (dispatch, token) => {
	const request = `/pedidos`;

	try {
		const response = await fetch(request, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		const data = await response.json();
		dispatch(setPedidos(data))
		return data;
	} catch (error) {
		throw error;
	}
};
