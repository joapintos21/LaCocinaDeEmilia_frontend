export const actualizarUsuario = async (id, telefono, nombre, email, rolId, status, token) => {
	const url = `/usuarios/update?id=${id}`;

	const body = {
		telefono: telefono,
		nombre: nombre,
		email: email,
		rol_id: parseInt(rolId),
		status: status,
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
