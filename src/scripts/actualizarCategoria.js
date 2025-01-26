export const actualizarCategoria = async (id, titulo, descripcion, token) => {
	const url = `/categorias/update/${id}`; 

	const body = {
		titulo: titulo,
		descripcion: descripcion,
	};

	try {
		const response = await fetch(url, {
			method: 'PUT', 
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
