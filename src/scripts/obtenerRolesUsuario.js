import { setRolesUsuario } from '../store/rolesUsuarioSlice';

export const obtenerRolesUsuario  = async (dispatch, token) => {
  let url = "/usuarios/roles";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Se produjo un error desconocido.");
    }

    const data = await response.json();
    dispatch(setRolesUsuario(data)); 
  } catch (error) {
    console.error(error);
    throw error; 
  }
};
export default obtenerRolesUsuario;