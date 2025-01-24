import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGestionAdicionales } from 'store/gestionAdicionalesSlice';
import { crearAdicional } from 'scripts/crearAdicional';
import { actualizarAdicional } from 'scripts/actualizarAdicional';
import { borrarAdicional } from 'scripts/borrarAdicional';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Paper,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputAdornment,
	Box,
	FormControlLabel,
	Checkbox,
	Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { obtenerTodosAdicionales } from 'scripts/obtenerTodosAdicionales';

const AdditionalManagement = () => {
	const [error, setError] = useState('');
	const dispatch = useDispatch();
	const fetchAdicionales = async () => {
		await obtenerTodosAdicionales(dispatch, sessionStorage.getItem('token'));
	};
	useEffect(() => {
		try {
			fetchAdicionales();
		} catch (e) {
			console.log(e);
		}
	}, [dispatch]);

	const adicionales = useSelector((state) => state.gestionAdicionales || []);

	const [open, setOpen] = useState(false);
	const [newAdicional, setNewAdicional] = useState({
		id: null,
		descripcion: '',
		costoAdicional: 0,
		visible: true,
	});
	const [searchTerm, setSearchTerm] = useState('');
	const [searchDescripcion, setSearchDescripcion] = useState('');

	const handleOpen = (adicional = null) => {
		if (adicional) {
			setNewAdicional({ ...adicional });
		} else {
			setNewAdicional({
				id: null,
				descripcion: '',
				costoAdicional: 0,
				visible: '',
			});
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewAdicional({ ...newAdicional, [name]: value });
	};

	const handleSaveAdicional = () => {
		if (newAdicional.descripcion && newAdicional.costoAdicional && newAdicional.visible != null) {
			if (newAdicional.id === null) {
				const adicionalToAdd = { ...newAdicional };
				crearAdicional(
					newAdicional.descripcion,
					newAdicional.costoAdicional,
					newAdicional.visible,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						fetchAdicionales();
						setError('');
					})
					.catch((error) => {
						setError('Error al crear el adicional.');
					});
				fetchAdicionales();
			} else {
				actualizarAdicional(
					newAdicional.id,
					newAdicional.descripcion,
					newAdicional.costoAdicional,
					newAdicional.visible,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						fetchAdicionales();
						setError('');
					})
					.catch((error) => {
						setError('Error al actualizar el adicional.');
					});
			}

			setNewAdicional({ descripcion: '', costoAdicional: 0, visible: '' });
			handleClose();
		} else {
			setError('Por favor, complete todos los campos.');
		}
	};

	const handleDelete = (id) => {
		borrarAdicional(id, sessionStorage.getItem('token'))
			.then((data) => {
				fetchAdicionales();
				setError('');
			})
			.catch((error) => {
				setError('Error al eliminar el adicional.');
			});
	};

	// Filtramos adicionales solo si adicionales es un array (prevención de errores)
	const filteredAdicionales = Array.isArray(adicionales)
		? adicionales.filter((adicional) => {
				return (
					adicional.descripcion.toLowerCase().includes(searchDescripcion.toLowerCase())
				);
		  })
		: [];

	return (
		<div style={{ marginTop: '20px' }}>
			{/* Barra de búsqueda y botón "Agregar" */}
			<Box
				sx={{
					marginBottom: 2,
					paddingBottom: 2,
					borderBottom: '2px solid #ccc',
				}}
			>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} sm={2} md={1}>
						<Button variant="contained" color="success" onClick={() => handleOpen()}>
							<AddIcon />
						</Button>
					</Grid>

					{/* Buscador por descripción */}
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Buscar por descripción"
							variant="outlined"
							fullWidth
							value={searchDescripcion}
							onChange={(e) => setSearchDescripcion(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
				</Grid>
			</Box>

			{/* Tabla de adicionales con Scrollbar */}
			<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
				<Table>
					<TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 1 }}>
						<TableRow>
							<TableCell>Descripción</TableCell>
							<TableCell>Costo adicional</TableCell>
							<TableCell>Visible</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredAdicionales.length > 0 ? (
							filteredAdicionales.map((adicional) => (
								<TableRow key={adicional.id}>
									<TableCell>{adicional.descripcion}</TableCell>
									<TableCell>{adicional.costoAdicional}</TableCell>
									<TableCell>{adicional.visible ? 'Sí' : 'No'}</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => handleOpen(adicional)}
											sx={{ marginRight: 2 }}
										>
											Editar
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => handleDelete(adicional.id)}
										>
											Eliminar
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={3} style={{ textAlign: 'center' }}>
									No hay adicionales disponibles.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Formulario para agregar o editar adicional */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{newAdicional.id ? 'Editar Adicional' : 'Agregar Adicional'}</DialogTitle>
				<DialogContent>
					Descripción
					<TextField
						name="descripcion"
						value={newAdicional.descripcion}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Costo adicional
					<TextField
						name="costoAdicional"
						value={newAdicional.costoAdicional}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={newAdicional.visible}
								onChange={(e) => setNewAdicional({ ...newAdicional, visible: e.target.checked })}
								color="primary"
							/>
						}
						label="Visible"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancelar
					</Button>
					<Button onClick={handleSaveAdicional} color="primary">
						{newAdicional.id ? 'Guardar Cambios' : 'Agregar'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Mostrar errores */}
			{error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
		</div>
	);
};

export default AdditionalManagement;
