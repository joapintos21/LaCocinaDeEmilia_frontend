export const borrarPermiso = async (id, token) => {
	const url = `/permisos/delete/${id}`; 

	try {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`, 
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		return { message: 'Permiso eliminado exitosamente' };
	} catch (error) {
		console.error(error);
		throw error; 
	}
};
