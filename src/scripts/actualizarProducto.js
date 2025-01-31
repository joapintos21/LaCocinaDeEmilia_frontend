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
				Authorization: `Bearer ${token}`, 
			},
		});
		return response.data; 
	} catch (error) {
		if (error.response) {
			const errorData = error.response.data;
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		} else if (error.request) {
			throw new Error('No se pudo establecer conexión con el servidor.');
		} else {
			throw new Error('Error al realizar la solicitud.');
		}
	}
};
