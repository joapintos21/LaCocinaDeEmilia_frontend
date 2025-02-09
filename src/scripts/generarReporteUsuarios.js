import { toast } from 'react-toastify';
import apiClient from '../utils/apiCliente';

export const generarReporteUsuarios = async (formato = 'pdf', token) => {
    try {
        const response = await apiClient.get('/reporte/generarReporteUsuarios', {
            params: { formato },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status !== 200) {
            throw new Error('Error al generar el reporte de usuarios.');
        }

        const base64File = response.data.file;
        if (!base64File) {
            throw new Error('No se recibió el archivo en la respuesta.');
        }

        const binaryData = Uint8Array.from(atob(base64File), (c) => c.charCodeAt(0));
        const fileType = formato === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf';
        const fileExtension = formato === 'excel' ? 'xlsx' : 'pdf';

        const blob = new Blob([binaryData], { type: fileType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reporte_usuarios.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Reporte de usuarios descargado correctamente en formato ${formato.toUpperCase()}.`);
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                toast.info('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', {
                    onClose: () => {
                        window.location.href = '/login';
                    },
                });
            } else {
                toast.error(error.response.data.error || `Error al generar el reporte de usuarios en formato ${formato.toUpperCase()}.`);
            }
        } else if (error.request) {
            toast.error('No se pudo establecer conexión con el servidor.');
        } else {
            toast.error('Error al realizar la solicitud.');
        }
        console.error(`Error al descargar el reporte de usuarios (${formato}):`, error);
    }
};
