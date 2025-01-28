export const obtenerPedidosUsuario = async (userId, token) => {
	const request = `/pedidos/obtenerPedidosUsuario?userId=${userId}`;

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
		return data;
	} catch (error) {
		throw error; 
	}
};
