export const obtenerPedidoCliente = async (pedidoId, token) => {
	const request = `/pedidos/show?id=${pedidoId}`;

	try {
		const response = await fetch(request, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el header de autorización
			},
		});

		// Maneja errores fuera del rango 200-299
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		throw error; // Lanza el error para que sea capturado en el evento
	}
};
