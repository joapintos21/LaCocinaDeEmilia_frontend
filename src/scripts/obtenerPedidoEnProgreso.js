import { setCarrito } from 'store/carritoSlice';

export const obtenerPedidoEnProgreso = async (userId, token, dispatch) => {
	const request = `/pedidos/obtenerPedidoEnProgreso?userId=${userId}`;

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
		dispatch(setCarrito(data)); 
	} catch (error) {
		throw error; 
	}
};
