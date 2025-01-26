export const actualizarAdicional = async (id, descripcion, costoAdicional, visible, token) => {
	const url = `/adicionales/update/${id}`; 

	const body = {
		descripcion: descripcion,
		costoAdicional: parseFloat(costoAdicional),
		visible: visible,
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
