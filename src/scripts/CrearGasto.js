let request, url, body;

export const crearGasto = async (descripcion, monto, fecha, token) => {
    request = '/gastos/registrarGasto';
    url = `${request}`;

    body = {
        descripcion,
        monto: parseFloat(monto),
        fecha,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Se produjo un error al registrar el gasto.');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al registrar el gasto:', error);
        throw error; 
    }
};