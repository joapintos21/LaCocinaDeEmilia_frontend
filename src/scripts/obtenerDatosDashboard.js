import { setDashboard } from 'store/dashboardSlice';

export const obtenerDatosDashboard = async (dispatch, token) => {
	let url = `/dashboard`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Se produjo un error desconocido.');
		}

		const data = await response.json();
        dispatch(setDashboard(data))
		return data; 
	} catch (error) {
		console.error(error);
		throw error; 
	}
};

export default obtenerDatosDashboard;
