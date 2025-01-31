export const obtenerPedidosParaCadete = async (userId, token) => {
    try {
        const response = await fetch(`/pedidos/obtenerPedidosParaCadete?usuario_id=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Hubo un problema al obtener los pedidos.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        throw error;
    }
};
