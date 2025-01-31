export const generarReporteGastos = async (startDateGastos, endDateGastos) => {
    try {
        const response = await fetch(`/reporte/generarReporteGastos?fechaInicio=${startDateGastos}&fechaFin=${endDateGastos}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Error al generar el reporte de gastos');

        const data = await response.json();
        const binaryData = Uint8Array.from(atob(data.file), (c) => c.charCodeAt(0));
        const blob = new Blob([binaryData], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reporte_gastos_${startDateGastos}_${endDateGastos}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error al descargar el reporte de gastos:', error);
        throw error;
    }
};