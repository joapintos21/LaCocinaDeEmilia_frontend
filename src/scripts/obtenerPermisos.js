import { setPermisos } from '../store/permisoSlice';

export const obtenerPermisos = async (dispatch, token) => {
  let url = "/permisos/obtenerPermisos?tipo_usuario=4";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Se produjo un error desconocido.");
    }

    const data = await response.json();
    dispatch(setPermisos(data.permisos)); 

  } catch (error) {
    console.error(error);
    throw error; 
  }
};

export default obtenerPermisos;