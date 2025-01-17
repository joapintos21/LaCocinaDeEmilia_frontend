import React from 'react';
import { Box, Button, Grid } from '@mui/material';

const ReportManagement = () => {
    const descargarReportePedidos = async () => {
        try {
            const response = await fetch('/reporte/generarReportePedidos', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Error al generar el reporte de pedidos');

            const data = await response.json();
            const binaryData = Uint8Array.from(atob(data.file), (c) => c.charCodeAt(0));
            const blob = new Blob([binaryData], { type: 'application/pdf' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'reporte_pedidos.pdf';
            link.click();
        } catch (error) {
            console.error('Error al descargar el reporte de pedidos:', error);
        }
    };

    const descargarReporteUsuarios = async () => {
        try {
            const response = await fetch('/reporte/generarReporteUsuarios', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Error al generar el reporte de usuarios');

            const data = await response.json();
            const binaryData = Uint8Array.from(atob(data.file), (c) => c.charCodeAt(0));
            const blob = new Blob([binaryData], { type: 'application/pdf' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'reporte_usuarios.pdf';
            link.click();
        } catch (error) {
            console.error('Error al descargar el reporte de usuarios:', error);
        }
    };

    return (
        <Box sx={{ marginTop: '20px' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={descargarReportePedidos}
                    >
                        Descargar Reporte de Pedidos
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={descargarReporteUsuarios}
                    >
                        Descargar Reporte de Usuarios
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReportManagement;
