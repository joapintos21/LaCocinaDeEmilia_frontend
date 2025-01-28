import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actualizarEmpresa } from 'scripts/actualizarEmpresa';
import { obtenerEmpresa } from 'scripts/obtenerEmpresa';
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
	Box
} from '@mui/material';

const EmpresaManagement = () => {
	const [error, setError] = useState('');
	const dispatch = useDispatch();
	const fetchEmpresa = async () => {
		await obtenerEmpresa(dispatch, sessionStorage.getItem('token'));
	};
	const [open, setOpen] = useState(false);
	const [newEmpresa, setNewEmpresa] = useState({
		id: null,
		nombre: null,
		direccion: null,
		descripcion_transferencia: null,
		telefono: null,
		correo: null,
	});

	useEffect(() => {
		try {
			fetchEmpresa();
		} catch (e) {
			console.log(e);
		}
	}, []);

	const empresa = useSelector((state) => state.empresa || []);

	const handleOpen = (empresa = null) => {
		setNewEmpresa(
			empresa
				? { ...empresa }
				: {
						id: null,
						nombre: null,
						direccion: null,
						descripcion_transferencia: null,
						telefono: null,
						correo: null,
				  },
		);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewEmpresa({ ...newEmpresa, [name]: value });
	};

	const handleSaveEmpresa = () => {
		if (
			newEmpresa.nombre
		) {
			if (newEmpresa.id != null) {
                if(newEmpresa.nombre === null || newEmpresa.nombre=== ""){
                    setError('El campo nombre es obligatorio.');
                } else{
                    if(newEmpresa.direccion===null || newEmpresa.direccion==="") newEmpresa.direccion=" ";
                    if(newEmpresa.descripcion_transferencia===null || newEmpresa.descripcion_transferencia==="") newEmpresa.descripcion_transferencia=" ";
                    if(newEmpresa.telefono===null || newEmpresa.telefono=="") newEmpresa.telefono=" ";
                    if(newEmpresa.correo===null || newEmpresa.correo==="") newEmpresa.correo=" ";
                    actualizarEmpresa(
                        newEmpresa,
                        sessionStorage.getItem('token'),
                    )
                        .then((data) => {
                            fetchEmpresa();
                            setError('');
                        })
                        .catch((error) => {
                            setError('Error al actualizar la empresa.');
                        });
                }
			} else {
				setError('Error al actualizar la empresa.');
			}

			setNewEmpresa({
				id: null,
				nombre: null,
				direccion: null,
				descripcion_transferencia: null,
				telefono: null,
				correo: null,
			});
			handleClose();
		} else {
			setError('Por favor, complete todos los campos.');
		}
	};

	return (
		<div style={{ marginTop: '20px' }}>
			<Box
				sx={{
					marginBottom: 2,
					paddingBottom: 2,
					borderBottom: '2px solid #ccc',
				}}
			></Box>

			{/* Tabla de empresa */}
			<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
				<Table>
					<TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF' }}>
						<TableRow>
							<TableCell>Nombre</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{empresa ? (
							<TableRow key={empresa.id}>
								<TableCell>{empresa.nombre}</TableCell>
								<TableCell>
									<Button
										variant="outlined"
										color="primary"
										onClick={() => handleOpen(empresa)}
										sx={{ marginRight: 2 }}
									>
										Editar
									</Button>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={2} style={{ textAlign: 'center' }}>
									La empresa no existe. Contacte a soporte para que sea creada mediante base de datos.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Formulario de edicion de Empresa */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Editar Empresa</DialogTitle>
				<DialogContent>
					Nombre
					<TextField
						name="nombre"
						value={newEmpresa.nombre}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Direccion
					<TextField
						name="direccion"
						value={newEmpresa.direccion}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Descripcion para transferencias
					<TextField
						name="descripcion_transferencia"
						value={newEmpresa.descripcion_transferencia}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Telefono
					<TextField
						name="telefono"
						value={newEmpresa.telefono}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Correo
					<TextField
						name="correo"
						value={newEmpresa.correo}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancelar
					</Button>
					<Button onClick={handleSaveEmpresa} color="primary">
						Guardar Cambios
					</Button>
				</DialogActions>
			</Dialog>

			{error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
		</div>
	);
};

export default EmpresaManagement;
