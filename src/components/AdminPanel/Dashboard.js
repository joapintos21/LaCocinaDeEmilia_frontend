import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	PointElement,
	LineElement,
} from 'chart.js';

import obtenerDatosDashboard from 'scripts/obtenerDatosDashboard';
import { dashboardSlice } from 'store/dashboardSlice';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const Dashboard = () => {
	// Opciones para desactivar la leyenda interactiva
	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: false, // Desactiva la leyenda
			},
		},
	};
	const dispatch = useDispatch();
	const fetchDatosDashboard = async () => {
		await obtenerDatosDashboard(dispatch, sessionStorage.getItem('token'));
	};
	useEffect(() => {
		try {
			fetchDatosDashboard();
		} catch (e) {
			console.log(e);
		}
	}, []);
	const datosDashboard = useSelector((state) => state.dashboard || []);

	// Datos para el gráfico de ventas (meses)
	const salesDataMonth = {
		labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
		datasets: [
			{
				label: 'Ventas del Mes',
				data: datosDashboard.dataPedidosPorMes,
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
		],
	};

	// Datos para el gráfico de ventas (semanas)

	function obtenerNumeroDeSemanas() {
		// Función para calcular el número de semanas en el mes actual
		const fecha = new Date();
		const mes = fecha.getMonth(); // Obtiene el mes actual (0 a 11)
		const primerDiaDelMes = new Date(fecha.getFullYear(), mes, 1); // Primer día del mes
		const ultimoDiaDelMes = new Date(fecha.getFullYear(), mes + 1, 0); // Último día del mes

		// Calculamos el número de días del mes
		const diasDelMes = (ultimoDiaDelMes - primerDiaDelMes) / (1000 * 3600 * 24) + 1;

		// Calculamos el número de semanas (dividimos los días entre 7)
		const numeroDeSemanas = Math.ceil(diasDelMes / 7);

		return numeroDeSemanas;
	}

	function generarEtiquetasDeSemanas() {
		// Generar las etiquetas de semanas dependiendo del número de semanas del mes
		const semanas = obtenerNumeroDeSemanas();
		const etiquetas = [];

		for (let i = 1; i <= semanas; i++) {
			etiquetas.push(`Semana ${i}`);
		}

		return etiquetas;
	}

	// Datos para el gráfico de ventas (semanas)
	const salesDataWeek = {
		labels: generarEtiquetasDeSemanas(), // Se ajusta dinámicamente
		datasets: [
			{
				label: 'Ventas del Mes',
				data: datosDashboard.dataPedidosPorSemana,
				backgroundColor: 'rgba(41, 204, 68, 0.2)',
				borderColor: 'rgb(18, 233, 29)',
				borderWidth: 1,
			},
		],
	};

	// Datos para el gráfico de usuarios
	const usersData = {
		labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
		datasets: [
			{
				label: 'Total de Usuarios',
				data: datosDashboard.dataUsuariosPorMes,
				fill: false,
				borderColor: 'rgba(153, 102, 255, 1)',
				tension: 0.1,
			},
		],
	};

	return (
		<Grid container spacing={3} sx={{ padding: 3 }}>
			{/* Tarjeta Total de Usuarios */}
			<Grid item xs={12} sm={6} md={4}>
				<Card>
					<CardContent>
						<Typography variant="h5" component="div">
							Total de Usuarios
						</Typography>
						<Typography variant="h3" color="text.secondary">
							{datosDashboard.cantUsuarios}
						</Typography>
						<Line data={usersData} options={options} />
					</CardContent>
				</Card>
			</Grid>

			{/* Tarjeta Pedidos del Año */}
			<Grid item xs={12} sm={6} md={4}>
				<Card>
					<CardContent>
						<Typography variant="h5" component="div">
							Pedidos del Año
						</Typography>
						<Typography variant="h3" color="text.secondary">
							{datosDashboard.totalPedidosPorMes}
						</Typography>
						<Bar data={salesDataMonth} options={options}/>
					</CardContent>
				</Card>
			</Grid>

			{/* Tarjeta Pedidos del Mes */}
			<Grid item xs={12} sm={6} md={4}>
				<Card>
					<CardContent>
						<Typography variant="h5" component="div">
							Pedidos del Mes
						</Typography>
						<Typography variant="h3" color="text.secondary">
							{datosDashboard.totalPedidosPorSemana}
						</Typography>
						<Bar data={salesDataWeek} options={options} />
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default Dashboard;
