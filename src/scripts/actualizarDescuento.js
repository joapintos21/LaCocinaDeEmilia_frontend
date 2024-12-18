export const actualizarDescuento = async (id, valor, fechaInicio, fechaFin, descripcion, token) => {
    const url = `/descuentos/update/${id}`;  
  
    const body = {
      tipo_id: 1, //Ajustar para manejar varios tipos de descuentos
      valor: parseFloat(valor),
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
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
  