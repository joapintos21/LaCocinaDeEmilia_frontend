import { setProductos } from 'store/productoSlice';

export const obtenerProductos = async (dispatch) => {
  let url = "/productos"; 

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Se produjo un error desconocido.");
    }

    const data = await response.json();
    dispatch(setProductos(data)); // Almacena los productos en Redux

  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error; 
  }
};