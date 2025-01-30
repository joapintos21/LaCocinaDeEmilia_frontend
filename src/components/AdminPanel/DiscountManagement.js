import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { crearDescuento } from 'scripts/crearDescuento';
import { actualizarDescuento } from 'scripts/actualizarDescuento';
import { borrarDescuento } from 'scripts/borrarDescuento';
import { obtenerTiposDescuento } from 'scripts/obtenerTiposDescuento';
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
import { obtenerDescuentos } from 'scripts/obtenerDescuentos';
import { mostrarValorDescuento } from 'utils/descuentosUtils';
import { toast } from 'react-toastify';
import CustomDialog from 'helpers/Dialog';

const DiscountManagement = () => {
	const dispatch = useDispatch();
	const fetchDescuentos = async () => {
		await obtenerDescuentos(dispatch, sessionStorage.getItem('token'));
	};
	const fetchtiposDescuento = async () => {
		await obtenerTiposDescuento(dispatch, sessionStorage.getItem('token'));
	};
	const [open, setOpen] = useState(false);
	const [newDescuento, setNewDescuento] = useState({
		id: null,
		tipoDescuento: null,
		valor: null,
		fechainicio: null,
		fechafin: null,
		descripcion: '',
	});
	const [searchDescripcion, setSearchDescripcion] = useState('');

	useEffect(() => {
		try {
			fetchDescuentos();
			fetchtiposDescuento();
		} catch (e) {
			console.log(e);
		}
	}, []);

	const descuentos = useSelector((state) => state.descuentos || []);
	const tiposDescuento = useSelector((state) => state.tiposDescuento || []);

	const handleOpen = (descuento = null) => {
		const tipoId =
			descuento && descuento.tipo ? tiposDescuento.find((tipo) => tipo.nombre === descuento.tipo)?.id : null;

		setNewDescuento(
			descuento
				? { ...descuento, tipoDescuento: tipoId }
				: {
						id: null,
						tipoDescuento: null,
						valor: null,
						fechainicio: null,
						fechafin: null,
						descripcion: '',
				  },
		);
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
		if (
			newDescuento.tipoDescuento &&
			newDescuento.valor &&
			newDescuento.fechainicio &&
			newDescuento.fechafin &&
			newDescuento.descripcion
		) {
			if (newDescuento.id === null) {
				crearDescuento(
					newDescuento.tipoDescuento,
					newDescuento.valor,
					newDescuento.fechainicio,
					newDescuento.fechafin,
					newDescuento.descripcion,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						toast.success('Descuento creado correctamente.');
						fetchDescuentos();
					})
					.catch((error) => {
						toast.error('Error al crear el descuento.');
					});
			} else {
				actualizarDescuento(
					newDescuento.id,
					newDescuento.tipoDescuento,
					newDescuento.valor,
					newDescuento.fechainicio,
					newDescuento.fechafin,
					newDescuento.descripcion,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						toast.success('Descuento actualizado correctamente.');
						fetchDescuentos();
					})
					.catch((error) => {
						toast.error('Error al actualizar el descuento.');
					});
			}

			setNewDescuento({
				valor: 0,
				fechainicio: null,
				fechafin: null,
				descripcion: '',
				tipoDescuento: null,
			});
			handleClose();
		} else {
			toast.error('Por favor, complete todos los campos.');
		}
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

	const handleConfirmDialog = () => {
		borrarDescuento(id, sessionStorage.getItem('token'))
			.then((data) => {
				toast.success('Descuento eliminado correctamente.');
				fetchDescuentos();
			})
			.catch((error) => {
				toast.error('Error al eliminar el descuento.');
			});
		setDialogOpen(false);
	};

	const filteredDescuentos = Array.isArray(descuentos)
		? descuentos.filter((descuento) => {
				return descuento.descripcion.toLowerCase().includes(searchDescripcion.toLowerCase());
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
					<TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF' }}>
						<TableRow>
							<TableCell>Tipo</TableCell>
							<TableCell>Valor</TableCell>
							<TableCell>Fecha de Inicio</TableCell>
							<TableCell>Fecha de Fin</TableCell>
							<TableCell>Descripción</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredDescuentos.length > 0 ? (
							filteredDescuentos.map((descuento) => (
								<TableRow key={descuento.id}>
									<TableCell>{descuento.tipo}</TableCell>
									<TableCell>{mostrarValorDescuento(descuento.valor, descuento.tipo)}</TableCell>
									<TableCell>{descuento.fechainicio}</TableCell>
									<TableCell>{descuento.fechafin}</TableCell>
									<TableCell>{descuento.descripcion}</TableCell>
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
											onClick={() => handleOpenDialog(descuento.id)}
										>
											Eliminar
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={4} style={{ textAlign: 'center' }}>
									No hay descuentos disponibles.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Formulario de descuento */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{newDescuento.id ? 'Editar Descuento' : 'Agregar Descuento'}</DialogTitle>
				<DialogContent>
					Tipo de descuento
					<TextField
						name="tipoDescuento"
						variant="outlined"
						value={newDescuento.tipoDescuento}
						onChange={handleInputChange}
						fullWidth
						select
						SelectProps={{
							native: true,
						}}
						style={{ marginBottom: '10px' }}
					>
						<option value="">Seleccionar tipo de descuento</option>
						{tiposDescuento.map((tipoDescuento) => (
							<option key={tipoDescuento.id} value={tipoDescuento.id}>
								{tipoDescuento.nombre}
							</option>
						))}
					</TextField>
					Valor de Descuento
					<TextField
						name="valor"
						type="number"
						value={newDescuento.valor}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Fecha de Inicio
					<TextField
						name="fechainicio"
						type="date"
						value={newDescuento.fechainicio}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Fecha de Fin
					<TextField
						name="fechafin"
						type="date"
						value={newDescuento.fechafin}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Descripción
					<TextField
						name="descripcion"
						value={newDescuento.descripcion}
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
			<CustomDialog
				open={dialogOpen}
				title="Confirmar eliminación"
				content="¿Está seguro de que desea eliminar este descuento?"
				onClose={handleCloseDialog}
				onConfirm={handleConfirmDialog}
			/>
		</div>
	);
};

export default DiscountManagement;
