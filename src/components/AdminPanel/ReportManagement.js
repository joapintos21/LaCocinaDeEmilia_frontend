import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, Paper} from '@mui/material';
import { generarReportePedidos } from 'scripts/generarReportePedidos';
import { generarReporteUsuarios } from 'scripts/generarReporteUsuarios';
import { generarReporteGastos } from 'scripts/generarReporteGastos';

const ReportManagement = () => {
    const [startDatePedidos, setStartDatePedidos] = useState('');
    const [endDatePedidos, setEndDatePedidos] = useState('');
    const [hasAttemptedSubmitPedidos, setHasAttemptedSubmitPedidos] = useState(false);
    const [startDateGastos, setStartDateGastos] = useState('');
    const [endDateGastos, setEndDateGastos] = useState('');
    const [hasAttemptedSubmitGastos, setHasAttemptedSubmitGastos] = useState(false);

    const validarFechasPedidos = () => {
        return (
            startDatePedidos &&
            endDatePedidos &&
            new Date(startDatePedidos) <= new Date(endDatePedidos)
        );
    };

    const validarFechasGastos = () => {
        return (
            startDateGastos &&
            endDateGastos &&
            new Date(startDateGastos) <= new Date(endDateGastos)
        );
    };

    const descargarReportePedidos = async () => {
        setHasAttemptedSubmitPedidos(true);
        if (!validarFechasPedidos()) {
            return;
        }
        try {
            await generarReportePedidos(startDatePedidos, endDatePedidos);
        } catch (error) {
            console.error('Error al descargar el reporte de pedidos:', error);
        }
    };

    const descargarReporteUsuarios = async () => {
        try {
            await generarReporteUsuarios();
        } catch (error) {
            console.error('Error al descargar el reporte de usuarios:', error);
        }
    };

    const descargarReporteGastos = async () => {
        setHasAttemptedSubmitGastos(true);
        if (!validarFechasGastos()) {
            return;
        }
        try {
            await generarReporteGastos(startDateGastos, endDateGastos);
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
                            value={startDatePedidos}
                            onChange={(e) => setStartDatePedidos(e.target.value)}
                            error={hasAttemptedSubmitPedidos && (!startDatePedidos || new Date(startDatePedidos) > new Date(endDatePedidos))}
                            helperText={
                                hasAttemptedSubmitPedidos && !startDatePedidos
                                    ? 'La fecha de inicio es obligatoria.'
                                    : hasAttemptedSubmitPedidos && new Date(startDatePedidos) > new Date(endDatePedidos)
                                    ? 'La fecha de inicio no puede ser posterior a la fecha de fin.'
                                    : ''
                            }
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha Fin"
                            type="date"
                            value={endDatePedidos}
                            onChange={(e) => setEndDatePedidos(e.target.value)}
                            error={hasAttemptedSubmitPedidos && (!endDatePedidos || new Date(startDatePedidos) > new Date(endDatePedidos))}
                            helperText={
                                hasAttemptedSubmitPedidos && !endDatePedidos
                                    ? 'La fecha de fin es obligatoria.'
                                    : ''
                            }
                            InputLabelProps={{ shrink: true }}
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
                            value={startDateGastos}
                            onChange={(e) => setStartDateGastos(e.target.value)}
                            error={hasAttemptedSubmitGastos && (!startDateGastos || new Date(startDateGastos) > new Date(endDateGastos))}
                            helperText={
                                hasAttemptedSubmitGastos && !startDateGastos
                                    ? 'La fecha de inicio es obligatoria.'
                                    : hasAttemptedSubmitGastos && new Date(startDateGastos) > new Date(endDateGastos)
                                    ? 'La fecha de inicio no puede ser posterior a la fecha de fin.'
                                    : ''
                            }
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha Fin"
                            type="date"
                            value={endDateGastos}
                            onChange={(e) => setEndDateGastos(e.target.value)}
                            error={hasAttemptedSubmitGastos && (!endDateGastos || new Date(startDateGastos) > new Date(endDateGastos))}
                            helperText={
                                hasAttemptedSubmitGastos && !endDateGastos
                                    ? 'La fecha de fin es obligatoria.'
                                    : ''
                            }
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