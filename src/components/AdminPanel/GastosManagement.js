import React, { useState, useEffect } from 'react';
import {
	Box,
	Button,
	Grid,
	TextField,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';
import { crearGasto } from 'scripts/crearGasto';
import { obtenerUltimosGastos } from 'scripts/obtenerUltimosGastos';
import { actualizarGasto } from 'scripts/actualizarGasto';
import { borrarGasto } from 'scripts/borrarGasto';
import { toast } from 'react-toastify';
import CustomDialog from 'helpers/Dialog';

const GastosManagement = () => {
	const [descripcion, setDescripcion] = useState('');
	const [monto, setMonto] = useState('');
	const [fecha, setFecha] = useState('');
	const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
	const [hasAttemptedEdit, setHasAttemptedEdit] = useState(false);
	const [gastos, setGastos] = useState([]);
	const [open, setOpen] = useState(false);
	const [currentGasto, setCurrentGasto] = useState(null);
	const token = sessionStorage.getItem('token');

	const fetchGastos = async () => {
		try {
			const data = await obtenerUltimosGastos(token);
			setGastos(data);
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		fetchGastos();
	}, []);

	const handleEdit = (gasto) => {
		setCurrentGasto(gasto);
		setOpen(true);
		setHasAttemptedEdit(false);
	};

	const [dialogOpen, setDialogOpen] = useState(false);
	const [id, setId] = useState(null);

	const handleOpenDialog = (id) => {
		setId(id);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setId(null);
		setDialogOpen(false);
	};

	const handleConfirmDialog = async () => {
		try {
			await borrarGasto(id, token);
			toast.success('Gasto eliminado con éxito.');
			fetchGastos();
		} catch (error) {
			toast.error(error.message);
		}
		setId(null);
		setDialogOpen(false);
	};

	const handleSave = async () => {
		setHasAttemptedEdit(true);
		if (!currentGasto.descripcion || !currentGasto.monto || currentGasto.monto <= 0 || !currentGasto.fecha) {
			return;
		}

		try {
			await actualizarGasto(currentGasto, token);
			toast.success(`Gasto actualizado con éxito: ${currentGasto.descripcion}`);
			fetchGastos();
			setOpen(false);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const registrarGasto = async () => {
		setHasAttemptedSubmit(true);
		if (!descripcion || !monto || !fecha || monto <= 0) {
			return;
		}

		try {
			const gasto = await crearGasto(descripcion, monto, fecha, token);
			toast.success(`Gasto registrado con éxito: ${gasto.descripcion}`);
			setDescripcion('');
			setMonto('');
			setFecha('');
			setHasAttemptedSubmit(false);
			fetchGastos();
		} catch (error) {
			console.error('Error al registrar el gasto:', error.message);
			toast.error(error.message);
		}
	};

	return (
		<Box sx={{ marginTop: '20px' }}>
			<Paper sx={{ padding: 3, marginBottom: 3 }}>
				<Typography variant="h6" gutterBottom>
					Registrar Gasto
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={4}>
						<TextField
							label="Descripción"
							value={descripcion}
							onChange={(e) => setDescripcion(e.target.value)}
							error={hasAttemptedSubmit && !descripcion}
							helperText={hasAttemptedSubmit && !descripcion ? 'La descripción es obligatoria.' : ''}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							label="Monto"
							type="number"
							value={monto}
							onChange={(e) => setMonto(e.target.value)}
							error={hasAttemptedSubmit && (!monto || monto <= 0)}
							helperText={
								hasAttemptedSubmit && (!monto || monto <= 0) ? 'El monto debe ser mayor que 0.' : ''
							}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							label="Fecha"
							type="date"
							value={fecha}
							onChange={(e) => setFecha(e.target.value)}
							error={hasAttemptedSubmit && !fecha}
							helperText={hasAttemptedSubmit && !fecha ? 'La fecha es obligatoria.' : ''}
							InputLabelProps={{ shrink: true }}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<Button variant="contained" color="secondary" fullWidth onClick={registrarGasto}>
							Registrar Gasto
						</Button>
					</Grid>
				</Grid>
			</Paper>

			<Typography variant="h6" gutterBottom>
				Últimos 10 Gastos
			</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Descripción</TableCell>
							<TableCell>Monto</TableCell>
							<TableCell>Fecha</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{gastos.map((gasto) => (
							<TableRow key={gasto.id}>
								<TableCell>{gasto.descripcion}</TableCell>
								<TableCell>{gasto.monto}</TableCell>
								<TableCell>{gasto.fecha}</TableCell>
								<TableCell>
									<Button
										variant="outlined"
										color="primary"
										onClick={() => handleEdit(gasto)}
										sx={{ marginRight: 1 }}
									>
										Editar
									</Button>
									<Button
										variant="outlined"
										color="secondary"
										onClick={() => handleOpenDialog(gasto.id)}
									>
										Eliminar
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Editar Gasto</DialogTitle>
				<DialogContent>
					<TextField
						label="Descripción"
						value={currentGasto?.descripcion || ''}
						onChange={(e) => setCurrentGasto({ ...currentGasto, descripcion: e.target.value })}
						error={hasAttemptedEdit && !currentGasto?.descripcion}
						helperText={
							hasAttemptedEdit && !currentGasto?.descripcion ? 'La descripción es obligatoria.' : ''
						}
						fullWidth
						margin="dense"
					/>
					<TextField
						label="Monto"
						type="number"
						value={currentGasto?.monto || ''}
						onChange={(e) => setCurrentGasto({ ...currentGasto, monto: parseFloat(e.target.value) })}
						error={hasAttemptedEdit && (!currentGasto?.monto || currentGasto?.monto <= 0)}
						helperText={
							hasAttemptedEdit && (!currentGasto?.monto || currentGasto?.monto <= 0)
								? 'El monto debe ser mayor que 0.'
								: ''
						}
						fullWidth
						margin="dense"
					/>
					<TextField
						label="Fecha"
						type="date"
						value={currentGasto?.fecha || ''}
						onChange={(e) => setCurrentGasto({ ...currentGasto, fecha: e.target.value })}
						error={hasAttemptedEdit && !currentGasto?.fecha}
						helperText={hasAttemptedEdit && !currentGasto?.fecha ? 'La fecha es obligatoria.' : ''}
						InputLabelProps={{ shrink: true }}
						fullWidth
						margin="dense"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancelar</Button>
					<Button onClick={handleSave}>Guardar</Button>
				</DialogActions>
			</Dialog>
			<CustomDialog
				open={dialogOpen}
				title="Confirmar eliminación"
				content="¿Está seguro de que desea eliminar este producto?"
				onClose={handleCloseDialog}
				onConfirm={handleConfirmDialog}
			/>
		</Box>
	);
};

export default GastosManagement;
