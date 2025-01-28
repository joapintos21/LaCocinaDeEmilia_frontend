let request, url, body;

export const agregarPackACarrito = async (clienteId, productoId, cantidad, token) => {
	request = '/carrito/agregarPackACarrito';
	url = `${request}`;

	body = {
		userId: clienteId,
		productoId: productoId,
		cantidad: cantidad,
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, 
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		const data = await response.json();

		return data; 
	} catch (error) {
		console.error(error);
		throw error; 
	}
};
