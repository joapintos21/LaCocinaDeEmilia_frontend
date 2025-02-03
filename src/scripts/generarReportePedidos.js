import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const generarReportePedidos = async (startDatePedidos, endDatePedidos, token) => {
    try {
        const response = await apiClient.get('/reporte/generarReportePedidos', {
            params: { 
                fechaInicio: startDatePedidos, 
                fechaFin: endDatePedidos 
            },
            headers: { 
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status !== 200) {
            throw new Error('Error al generar el reporte de pedidos.');
        }

        const base64File = response.data.file;
        if (!base64File) {
            throw new Error('No se recibió el archivo en la respuesta.');
        }

        const binaryData = Uint8Array.from(atob(base64File), (c) => c.charCodeAt(0));
        const blob = new Blob([binaryData], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reporte_pedidos_${startDatePedidos}_${endDatePedidos}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Reporte de pedidos descargado correctamente.');
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                toast.info('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', {
                    onClose: () => {
                        window.location.href = '/login';
                    },
                });
            } else {
                toast.error(error.response.data.error || 'Error al generar el reporte de pedidos.');
            }
        } else if (error.request) {
            toast.error('No se pudo establecer conexión con el servidor.');
        } else {
            toast.error('Error al realizar la solicitud.');
        }
        console.error('Error al descargar el reporte de pedidos:', error);
    }
};
