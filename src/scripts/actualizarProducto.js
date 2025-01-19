export const actualizarProducto = async (id, descripcion, precio, categoria_id, visible, imagen, token) => {
	const url = `/productos/update?id=${id}`; 

	const body = {
		descripcion: descripcion,
		precio: precio,
		categoria_id: categoria_id,
		visible: visible,
		imagen: imagen
	};

	try {
		const response = await fetch(url, {
			method: 'PUT', 
			headers: {
				'Content-Type': 'application/json', 
				Authorization: `Bearer ${token}`, 
			},
			body: JSON.stringify(body)
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
