import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, Paper } from '@mui/material';
import { generarReportePedidos } from 'scripts/generarReportePedidos';
import { generarReporteUsuarios } from 'scripts/generarReporteUsuarios';
import { generarReporteGastos } from 'scripts/generarReporteGastos';

const ReportManagement = () => {
    const [startDatePedidos, setStartDatePedidos] = useState('');
    const [endDatePedidos, setEndDatePedidos] = useState('');
    const [startDateGastos, setStartDateGastos] = useState('');
    const [endDateGastos, setEndDateGastos] = useState('');

    const descargarReporte = async (tipo, formato) => {
        try {
            const formatoCorrecto = formato === "xlsx" ? "excel" : formato; // Corrige el valor enviado
    
            if (tipo === 'pedidos') {
                await generarReportePedidos(startDatePedidos, endDatePedidos, formatoCorrecto);
            } else if (tipo === 'usuarios') {
                await generarReporteUsuarios(formatoCorrecto);
            } else if (tipo === 'gastos') {
                await generarReporteGastos(startDateGastos, endDateGastos, formatoCorrecto);
            }
        } catch (error) {
            console.error(`Error al descargar el reporte de ${tipo}:`, error);
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
                    <Grid item xs={6}>
                        <TextField
                            label="Fecha Inicio"
                            type="date"
                            value={startDatePedidos}
                            onChange={(e) => setStartDatePedidos(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Fecha Fin"
                            type="date"
                            value={endDatePedidos}
                            onChange={(e) => setEndDatePedidos(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" fullWidth onClick={() => descargarReporte('pedidos', 'pdf')}>
                            Descargar PDF
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="secondary" fullWidth onClick={() => descargarReporte('pedidos', 'xlsx')}>
                            Descargar Excel
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Reporte de Usuarios */}
            <Paper sx={{ padding: 3, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Generar reporte de Usuarios
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" fullWidth onClick={() => descargarReporte('usuarios', 'pdf')}>
                            Descargar PDF
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="secondary" fullWidth onClick={() => descargarReporte('usuarios', 'xlsx')}>
                            Descargar Excel
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Reporte de Gastos */}
            <Paper sx={{ padding: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Generar reporte de Gastos
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Fecha Inicio"
                            type="date"
                            value={startDateGastos}
                            onChange={(e) => setStartDateGastos(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Fecha Fin"
                            type="date"
                            value={endDateGastos}
                            onChange={(e) => setEndDateGastos(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" fullWidth onClick={() => descargarReporte('gastos', 'pdf')}>
                            Descargar PDF
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="secondary" fullWidth onClick={() => descargarReporte('gastos', 'xlsx')}>
                            Descargar Excel
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ReportManagement;
