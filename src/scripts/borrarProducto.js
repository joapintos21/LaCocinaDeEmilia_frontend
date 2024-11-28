export const borrarProducto = async (id, token) => {
    const url = `/productos/delete/${id}`;  // URL del endpoint
  
    try {
      const response = await fetch(url, {
        method: "DELETE", 
        headers: {
          "Authorization": `Bearer ${token}`, // Incluir el token en el header de autorización
        }
      });
  
      // Si la respuesta no es exitosa (fuera de la gama 200-299)
      if (!response.ok) {
        const errorData = await response.json();  // Extraer datos del error
        throw new Error(errorData.error || "Se produjo un error desconocido.");
      }
  
      // Si la respuesta es exitosa y no tiene cuerpo, devolver mensaje de éxito
      return { message: "Producto eliminado exitosamente" };
  
    } catch (error) {
      console.error(error);
      throw error;  // Lanza el error para que lo maneje el llamador
    }
  };
  