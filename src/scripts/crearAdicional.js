let request, url, body;

export const crearAdicional = async (descripcion, costoAdicional, visible, token) => {
	request = '/adicionales/create';
	url = `${request}`;

	body = {
		descripcion: descripcion,
		costoAdicional: parseFloat(costoAdicional),
		visible: visible,
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
