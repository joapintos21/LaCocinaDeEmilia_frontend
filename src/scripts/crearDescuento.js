let request, url, body;

export const crearDescuento = async (tipoId, valor, fechaInicio, fechaFin, descripcion, token) => {
  request = "/descuentos/create";
  url = `${request}`;

  body = {
    tipo_id : parseInt(tipoId), 
    valor : parseFloat(valor),
    fechainicio : fechaInicio,
    fechafin : fechaFin,
    descripcion : descripcion
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Se produjo un error desconocido.");
    }

    const data = await response.json();
    return data; 

  } catch (error) {
    console.error(error);
    throw error; 
  }
};