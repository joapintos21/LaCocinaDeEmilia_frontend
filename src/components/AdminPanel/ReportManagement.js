import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, Paper} from '@mui/material';

const ReportManagement = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const descargarReportePedidos = async () => {
        if (!startDate || !endDate) {
            alert('Por favor, selecciona las fechas de inicio y fin.');
            return;
        }
        try {
            const response = await fetch(`/reporte/generarReportePedidos?fechaInicio=${startDate}&fechaFin=${endDate}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Error al generar el reporte de pedidos');

            const data = await response.json();
            const binaryData = Uint8Array.from(atob(data.file), (c) => c.charCodeAt(0));
            const blob = new Blob([binaryData], { type: 'application/pdf' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `reporte_pedidos_${startDate}_${endDate}.pdf`;
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

    const descargarReporteGastos = async () => {
        if (!startDate || !endDate) {
            alert('Por favor, selecciona las fechas de inicio y fin.');
            return;
        }

        try {
            const response = await fetch(`/reporte/generarReporteGastos?fechaInicio=${startDate}&fechaFin=${endDate}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Error al generar el reporte de gastos');

            const data = await response.json();
            const binaryData = Uint8Array.from(atob(data.file), (c) => c.charCodeAt(0));
            const blob = new Blob([binaryData], { type: 'application/pdf' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `reporte_gastos_${startDate}_${endDate}.pdf`;
            link.click();
        } catch (error) {
            console.error('Error al descargar el reporte de gastos:', error);
        }
    };

    return (
        <Box sx={{ marginTop: '20px' }}>
            {/* Reporte de Pedidos */}
            <Paper sx={{ padding: 3, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom>
                Generar reporte de Pedidos
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha Inicio"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha Fin"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={descargarReportePedidos}
                        >
                            Descargar reporte de Pedidos
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Reporte de Usuarios */}
            <Paper sx={{ padding: 3, marginBottom: 2  }}>
                <Typography variant="h6" gutterBottom>
                Generar reporte de Usuarios
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={descargarReporteUsuarios}
                        >
                            Descargar reporte de Usuarios
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            {/* Sección para generar reporte de gastos */}
            <Paper sx={{ padding: 3}}>
                <Typography variant="h6" gutterBottom>
                    Generar reporte de Gastos
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha Inicio"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha Fin"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" fullWidth onClick={descargarReporteGastos}>
                            Descargar reporte de Gastos
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ReportManagement;