let request, url, body;

export const crearPermiso = async (endpoint, tipo, rolId, token) => {
	request = '/permisos/create';
	url = `${request}`;
  
  body = {
    endpoint: endpoint,
    tipo: tipo,
    rol_id : parseInt(rolId)
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
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
