export const actualizarEmpresa = async ({id, nombre, direccion, descripcion_transferencia, telefono, correo }, token) => {
	const url = `/empresa/update`; 

	const body = {
        id: id,
        descripcion_transferencia: descripcion_transferencia,
        correo: correo,
        direccion: direccion,
        telefono: telefono,
        nombre: nombre
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
