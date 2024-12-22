let request, url, body;

export const crearProducto = async (descripcion, precio, categoria_id, visible, token) => {
	request = '/productos/create'; // Endpoint para crear el producto
	url = `${request}`; // URL del API para crear producto

	// Cuerpo de la solicitud con los datos del nuevo producto
	body = {
		descripcion: descripcion, // Descripción del producto
		precio: parseFloat(precio), // Precio del producto (asegurándose de que es un número flotante)
		categoria_id: parseInt(categoria_id), // ID de la categoría (asegurándose de que es un número entero)
		visible: visible, // Indica si el producto es visible (booleano)
	};

	try {
		const response = await fetch(url, {
			method: 'POST', // Método POST para crear
			headers: {
				'Content-Type': 'application/json', // Tipo de contenido JSON
				Authorization: `Bearer ${token}`, // Token de autenticación en los headers
			},
			body: JSON.stringify(body), // Convertimos el cuerpo en un string JSON
		});

		// Manejo de errores fuera del rango 200-299
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		// Procesamos la respuesta cuando la creación es exitosa
		const data = await response.json();
		return data; // Devolvemos la data que nos da la respuesta
	} catch (error) {
		console.error('Error al crear el producto:', error);
		throw error; // Lanza el error para que sea manejado por el componente que llama a esta función
	}
};
