let request, url, body;

export const crearProducto = async ({ descripcion, precio, categoria_id, visible, imagen }, token) => {
	request = '/productos/create';
	url = `${request}`;

	body = {
		descripcion: descripcion,
		precio: parseFloat(precio),
		categoria_id: parseInt(categoria_id),
		visible: visible,
		imagen: imagen,
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
		console.error('Error al crear el producto:', error);
		throw error;
	}
};
