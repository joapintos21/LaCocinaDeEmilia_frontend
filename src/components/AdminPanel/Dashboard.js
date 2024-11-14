import React from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Dashboard = () => {
  // Datos para el gráfico de ventas (meses)
  const salesData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Ventas del Mes',
        data: [5000, 7000, 4000, 6000, 8000, 7500, 9500, 11000, 12000, 13500, 14000, 16000],  // Datos de ejemplo
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
        data: [1200, 1500, 1700, 1600, 1800, 2100, 2500, 2700, 3000, 3200, 3500, 3800],  // Datos de ejemplo
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
      },
    ],
  };

  // Datos para el gráfico de comentarios recientes
  const commentsData = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [
      {
        label: 'Comentarios Recientes',
        data: [45, 70, 65, 100],  // Datos de ejemplo
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
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
              1,230
            </Typography>
            <Line data={usersData} options={{ responsive: true }} />
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Ver detalles
            </Button>
          </CardActions>
        </Card>
      </Grid>

      {/* Tarjeta Ventas del Mes */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Ventas del Mes
            </Typography>
            <Typography variant="h3" color="text.secondary">
              $50,000
            </Typography>
            <Bar data={salesData} options={{ responsive: true }} />
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Ver detalles
            </Button>
          </CardActions>
        </Card>
      </Grid>

      {/* Tarjeta Comentarios Recientes */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Comentarios Recientes
            </Typography>
            <Typography variant="h3" color="text.secondary">
              245
            </Typography>
            <Line data={commentsData} options={{ responsive: true }} />
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Ver detalles
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
