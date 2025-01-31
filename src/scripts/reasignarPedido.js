export const reasignarPedido = async (pedidoId, userId, token) => {
    try {
        const response = await fetch('/pedidos/reasignarPedido', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ pedido_id: pedidoId, userId }),
        });

        if (!response.ok) throw new Error('Error al reasignar el pedido');

        return true;
    } catch (error) {
        console.error('Error al reasignar pedido:', error);
        throw error;
    }
};
