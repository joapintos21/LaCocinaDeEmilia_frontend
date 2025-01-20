export const obtenerUltimosGastos = async (token) => {
    const url = '/gastos/obtenerUltimosGastos';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al obtener los últimos gastos.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los últimos gastos:', error);
        throw error;
    }
};
