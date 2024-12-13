import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDescuento, updateDescuento, deleteDescuento } from 'store/descuentoSlice'; // Asegúrate de que las acciones estén correctamente definidas en el slice
import { crearDescuento } from 'scripts/crearDescuento'; // Función para crear descuento
import { actualizarDescuento } from 'scripts/actualizarDescuento'; // Función para actualizar descuento
import { borrarDescuento } from 'scripts/borrarDescuento'; // Función para eliminar descuento
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
	Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const DiscountManagement = () => {
	const [error, setError] = useState('');
	const dispatch = useDispatch();

	// Obtén los descuentos del store; si no están disponibles, usa un array vacío
	const descuentos = useSelector((state) => state.descuentos || []);

	const [open, setOpen] = useState(false);
	const [newDescuento, setNewDescuento] = useState({ id: null, nombre: '', descripcion: '', porcentaje: '' });
	const [searchTerm, setSearchTerm] = useState('');
	const [searchDescripcion, setSearchDescripcion] = useState('');

	useEffect(() => {
		setError(''); // Limpia los errores en cada renderizado
	}, [dispatch]);

	const handleOpen = (descuento = null) => {
		setNewDescuento(descuento ? { ...descuento } : { id: null, nombre: '', descripcion: '', porcentaje: '' });
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewDescuento({ ...newDescuento, [name]: value });
	};

	const handleSaveDescuento = () => {
		if (newDescuento.nombre && newDescuento.descripcion && newDescuento.porcentaje) {
			if (newDescuento.id === null) {
				const descuentoToAdd = { ...newDescuento };
				dispatch(addDescuento(descuentoToAdd));

				crearDescuento(
					newDescuento.nombre,
					newDescuento.descripcion,
					newDescuento.porcentaje,
					sessionStorage.getItem('token'),
				)
					.then((data) => console.log('Descuento agregado:', data))
					.catch((error) => {
						console.error('Error al crear el descuento:', error.message);
						setError(error.message);
					});
			} else {
				actualizarDescuento(
					newDescuento.id,
					newDescuento.nombre,
					newDescuento.descripcion,
					newDescuento.porcentaje,
					sessionStorage.getItem('token'),
				)
					.then((data) => console.log('Descuento actualizado:', data))
					.catch((error) => {
						console.error('Error al actualizar el descuento:', error.message);
						setError(error.message);
					});
				dispatch(updateDescuento(newDescuento));
			}

			setNewDescuento({ nombre: '', descripcion: '', porcentaje: '' });
			handleClose();
		} else {
			setError('Por favor, complete todos los campos.');
		}
	};

	const handleDelete = (id) => {
		borrarDescuento(id, sessionStorage.getItem('token'))
			.then((data) => console.log('Descuento eliminado:', data))
			.catch((error) => {
				console.error('Error al eliminar el descuento:', error.message);
				setError(error.message);
			});
		dispatch(deleteDescuento(id));
	};

	// Filtra los descuentos asegurándote de que `descuentos` es un array
	const filteredDescuentos =
		Array.isArray(descuentos) ?
			descuentos.filter((descuento) => {
				return (
					descuento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
					descuento.descripcion.toLowerCase().includes(searchDescripcion.toLowerCase())
				);
			})
		:	[];

	return (
		<div style={{ marginTop: '20px' }}>
			{/* Barra de búsqueda y botón "Agregar" */}
			<Box sx={{ marginBottom: 2, paddingBottom: 2, borderBottom: '2px solid #ccc' }}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} sm={2} md={1}>
						<Button variant="contained" color="success" onClick={() => handleOpen()}>
							<AddIcon />
						</Button>
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<TextField
							label="Buscar por nombre"
							variant="outlined"
							fullWidth
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon />
									</InputAdornment>
								),
							}}
						/>
					</Grid>

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

			{/* Tabla de descuentos */}
			<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
				<Table>
					<TableHead sx={{ position: 'sticky', top: 0 }}>
						<TableRow>
							<TableCell>Nombre</TableCell>
							<TableCell>Descripción</TableCell>
							<TableCell>Descuento (%)</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredDescuentos.length > 0 ?
							filteredDescuentos.map((descuento) => (
								<TableRow key={descuento.id}>
									<TableCell>{descuento.nombre}</TableCell>
									<TableCell>{descuento.descripcion}</TableCell>
									<TableCell>{descuento.porcentaje}%</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => handleOpen(descuento)}
											sx={{ marginRight: 2 }}
										>
											Editar
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => handleDelete(descuento.id)}
										>
											Eliminar
										</Button>
									</TableCell>
								</TableRow>
							))
						:	<TableRow>
								<TableCell colSpan={4} style={{ textAlign: 'center' }}>
									No hay descuentos disponibles.
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Formulario de descuento */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{newDescuento.id ? 'Editar Descuento' : 'Agregar Descuento'}</DialogTitle>
				<DialogContent>
					<TextField
						label="Nombre"
						name="nombre"
						value={newDescuento.nombre}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					<TextField
						label="Descripción"
						name="descripcion"
						value={newDescuento.descripcion}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					<TextField
						label="Porcentaje de Descuento"
						name="porcentaje"
						type="number"
						value={newDescuento.porcentaje}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancelar
					</Button>
					<Button onClick={handleSaveDescuento} color="primary">
						{newDescuento.id ? 'Guardar Cambios' : 'Agregar'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Mostrar errores */}
			{error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
		</div>
	);
};

export default DiscountManagement;
