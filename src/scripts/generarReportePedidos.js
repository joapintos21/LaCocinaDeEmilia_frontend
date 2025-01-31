export const generarReportePedidos = async (startDatePedidos, endDatePedidos) => {
    try {
        const response = await fetch(`/reporte/generarReportePedidos?fechaInicio=${startDatePedidos}&fechaFin=${endDatePedidos}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Error al generar el reporte de pedidos');

        const data = await response.json();
        const binaryData = Uint8Array.from(atob(data.file), (c) => c.charCodeAt(0));
        const blob = new Blob([binaryData], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reporte_pedidos_${startDatePedidos}_${endDatePedidos}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error al descargar el reporte de pedidos:', error);
        throw error;
    }
};