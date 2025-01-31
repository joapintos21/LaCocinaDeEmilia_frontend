export const reasignarPedidoCadete = async (pedidoId, userId, token) => {
    try {
        const response = await fetch('/pedidos/reasignarCadete', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pedido_id: pedidoId, userId: userId }),
        });

        if (!response.ok) {
            throw new Error('No se pudo reasignar el pedido.');
        }

        return response.json();
    } catch (error) {
        console.error('Error al reasignar pedido:', error);
        throw error;
    }
};