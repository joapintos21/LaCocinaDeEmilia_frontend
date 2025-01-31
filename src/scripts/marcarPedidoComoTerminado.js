export const marcarPedidoComoTerminado = async (pedidoId, token) => {
    try {
        const response = await fetch('/pedidos/marcarComoTerminado', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ pedido_id: pedidoId }),
        });

        if (!response.ok) throw new Error('Error al marcar el pedido como terminado');

        return true;
    } catch (error) {
        console.error('Error al marcar pedido como terminado:', error);
        throw error;
    }
};
