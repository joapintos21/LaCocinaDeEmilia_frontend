export const borrarGasto = async (id, token) => {
    const url = `/gastos/delete/${id}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Se produjo un error al eliminar el gasto.');
        }

        return { message: 'Gasto eliminado exitosamente' };
    } catch (error) {
        console.error('Error al eliminar el gasto:', error.message);
        throw error;
    }
};
