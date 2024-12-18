export const actualizarDescuento = async (id, tipoId, valor, fechaInicio, fechaFin, descripcion, token) => {
    const url = `/descuentos/update/${id}`;  
  
    const body = {
      tipo_id: parseInt(tipoId), 
      valor: parseFloat(valor),
      fechainicio: fechaInicio,
      fechafin: fechaFin,
      descripcion: descripcion
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
  