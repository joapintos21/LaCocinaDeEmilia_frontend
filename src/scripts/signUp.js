let request, url, body;

export const crearUsuario = async (email, password, nombre, telefono, rol_id) => {
	request = '/usuarios/create';
	url = `${request}`;

	body = {
		email: email,
		password: password,
		nombre: nombre,
		telefono: telefono,
		rol_id: rol_id,
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		// Maneja errores fuera del rango 200-299
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		const data = await response.json();
		return data; // Devuelve los datos de la respuesta
	} catch (error) {
		console.error(error);
		throw error; // Lanza el error para que sea capturado en el evento
	}
};
