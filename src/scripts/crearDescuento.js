let request, url, body;

export const crearDescuento = async (tipoId, valor, fechaInicio, fechaFin, descripcion, token) => {
  request = "/descuentos/create";
  url = `${request}`;

  body = {
    tipoId : tipoId,
    valor : valor,
    fechaInicio : fechaInicio,
    fechaFin : fechaFin,
    descripcion : descripcion
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` // Pasa el token en el header
      },
      body: JSON.stringify(body),
    });

    // Maneja errores fuera del rango 200-299
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Se produjo un error desconocido.");
    }

    const data = await response.json();
    return data; // Devuelve los datos de la respuesta

  } catch (error) {
    console.error(error);
    throw error; // Lanza el error para que sea capturado en el evento
  }
};