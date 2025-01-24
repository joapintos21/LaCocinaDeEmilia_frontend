export const actualizarGasto = async (gasto, token) => {
    const url = `/gastos/update/${gasto.id}`;

    const body = {
        descripcion: gasto.descripcion,
        monto: gasto.monto,
        fecha: gasto.fecha,
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Se produjo un error al actualizar el gasto.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar el gasto:', error.message);
        throw error;
    }
};
