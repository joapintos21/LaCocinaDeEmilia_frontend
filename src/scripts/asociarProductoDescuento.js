export const asociarProductoDescuento = async (descuento_id, producto_id, token) => {
	const url = `/productos/crearDescuento`;

	const body = {
		descuento_id: descuento_id,
		producto_id: producto_id,
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
