export const borrarCategoria = async (id, token) => {
    // Usar el ID directamente en la URL del endpoint
    const url = `/api/categorias/delete/${id}`;  // Asumiendo que el servidor espera el ID en la URL
  
    try {
      // Hacer la solicitud DELETE
      const response = await fetch(url, {
        method: "DELETE", // Método DELETE
        headers: {
          "Content-Type": "application/json",  // El contenido es JSON (aunque no es estrictamente necesario para DELETE)
          "Authorization": `Bearer ${token}`, // Incluir el token en el header de autorización
        }
      });
  
      // Manejar errores fuera del rango 200-299
      if (!response.ok) {
        const errorData = await response.json();  // Extraer datos del error si el servidor devuelve un cuerpo
        throw new Error(errorData.error || "Se produjo un error desconocido.");
      }
  
      // Si la respuesta es exitosa y no tiene cuerpo, solo devuelve un mensaje de éxito
      return { message: "Categoría eliminada exitosamente" };  // Opcional: puedes devolver algo específico si la API lo permite
    } catch (error) {
      console.error(error);
      throw error;  // Lanza el error para que lo maneje el llamador
    }
  };
  