import apiCliente from 'utils/apiCliente';

let request, body;

export const actualizarProducto = async (id, { descripcion, precio, categoria_id, visible, imagen }, token) => {
	request = '/productos/update';

	body = {
		id: id,
		descripcion: descripcion,
		precio: precio,
		categoria_id: categoria_id,
		visible: visible,
		imagen: imagen,
	};

	try {
		const response = await apiCliente.put(request, body, {
			headers: {
				Authorization: `Bearer ${token}`, // Incluir el token en el header de autorización
			},
		});
		return response.data; // Devuelve los datos de la respuesta
	} catch (error) {
		// Manejo de errores
		if (error.response) {
			// Si el error tiene respuesta, lanza el mensaje adecuado
			const errorData = error.response.data;
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		} else if (error.request) {
			// Si no se recibe respuesta del servidor
			throw new Error('No se pudo establecer conexión con el servidor.');
		} else {
			// Error al configurar la solicitud
			throw new Error('Error al realizar la solicitud.');
		}
	}
};
