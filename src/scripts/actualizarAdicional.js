export const actualizarAdicional = async (id, descripcion, costoAdicional, visible, token) => {
    // Usar el ID directamente en la URL del endpoint
    const url = `/adicionales/update/${id}`;  // Asumiendo que el servidor espera el ID en la URL
  
    // Crear el objeto de datos que se enviará en el cuerpo de la solicitud
    const body = {
      descripcion: descripcion,
      costoAdicional: costoAdicional,
      visible: visible
    };
  
    try {
      // Hacer la solicitud PUT
      const response = await fetch(url, {
        method: "PUT", // Método PUT
        headers: {
          "Content-Type": "application/json",  // El contenido es JSON
          "Authorization": `Bearer ${token}`, // Incluir el token en el header de autorización
        },
        body: JSON.stringify(body),  // Convertimos el body a JSON
      });
  
      // Manejar errores fuera del rango 200-299
      if (!response.ok) {
        const errorData = await response.json();  // Extraer datos del error
        throw new Error(errorData.error || "Se produjo un error desconocido.");
      }
  
      // Obtener y retornar los datos de la respuesta
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;  // Lanza el error para que lo maneje el llamador
    }
  };
  