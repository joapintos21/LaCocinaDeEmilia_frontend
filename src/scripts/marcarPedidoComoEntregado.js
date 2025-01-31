export const marcarPedidoComoEntregado = async (pedidoId, token) => {
    try {
        const response = await fetch('/pedidos/marcarComoEntregado', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pedido_id: pedidoId }),
        });

        if (!response.ok) {
            throw new Error('No se pudo marcar el pedido como entregado.');
        }

        return response.json();
    } catch (error) {
        console.error('Error al marcar pedido como entregado:', error);
        throw error;
    }
};