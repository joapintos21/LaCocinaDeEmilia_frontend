export const obtenerPedidosParaCocinera = async (userId, token) => {
    try {
        const response = await fetch(`/pedidos/obtenerPedidosParaCocinera?usuario_id=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al obtener pedidos');
        
        return await response.json();
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        throw error;
    }
};
