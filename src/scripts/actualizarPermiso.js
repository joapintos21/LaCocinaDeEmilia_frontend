export const actualizarPermiso = async (id, endpoint, tipo, rolId, token) => {
    const url = `/permisos/update/${id}`; 
  
    const body = {
      endpoint: endpoint,
      tipo: tipo,
      rol_id: parseInt(rolId)
    };
  
    try {
      const response = await fetch(url, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",  
          "Authorization": `Bearer ${token}`, 
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