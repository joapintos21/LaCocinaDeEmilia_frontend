// components/cart/AddressSelector.js
import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import { obtenerDireccionesUsuario } from 'scripts/obtenerDireccionesUsuario';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { crearDireccion } from 'scripts/crearDireccion';
import { setCostoEnvio, setDireccion } from 'store/carritoSlice';
import { obtenerCostoEnvio } from 'scripts/obtenerCostoEnvio';
import DireccionesModal from '../DireccionesModal';
import { Star } from '@mui/icons-material';

const Container = tw.div`flex flex-col w-full`;
const Title = tw.h2`text-2xl font-bold mb-4`;
const AddressList = tw.div`bg-gray-100 p-4 rounded-lg shadow-md`;
const AddressItem = tw.div`flex justify-between items-center border-b pb-2 mb-2 cursor-pointer p-2 rounded relative`;
const StarIcon = tw(Star)`absolute top-0 right-0 m-2 text-yellow-500 z-10`;
const Buttons = tw.div`flex justify-between`;
const SelectButton = tw.button`mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 self-start`;
const NextButton = tw.button`mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 self-end`;

const AddressSelector = ({ step, setStep, direccionId }) => {
	const dispatch = useDispatch();
	const [direcciones, setDirecciones] = useState([]);
	const [mostrarModalDirecciones, setMostrarModalDirecciones] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const token = sessionStorage.getItem('token');
	const user = useSelector((state) => state.usuario);
	let userId = null;
	if (user.isLoggedIn) {
		userId = user.userInfo.id;
	}
	const pedidoId = useSelector((state) => state.carrito.pedidoId);

	const seleccionarDireccion = async (id) => {
		dispatch(setDireccion(id));
		obtenerCostoEnvio(id, pedidoId, token)
			.then((data) => {
				if (data && data.costoEnvio) {
					toast.success('Costo de envío actualizado.');
					dispatch(setCostoEnvio(data.costoEnvio));
				} else {
					toast.error('Error al obtener el costo de envio.');
					console.log(data);
				}
			})
			.catch((e) => {
				toast.error('Error al obtener el costo de envio:', e);
			});
	};

	const fetchDirecciones = async () => {
		try {
			obtenerDireccionesUsuario(userId, token)
				.then((data) => {
					setDirecciones(data);
					const direccionDefault = data.find((direccion) => direccion.predeterminado);
					if (direccionDefault && direccionId === '') {
						dispatch(setDireccion(direccionDefault.id));
						if (step === 3) {
							seleccionarDireccion(direccionDefault.id);
						}
					}
				})
				.catch((e) => {
					toast.error('Error al obtener las direcciones:' + e);
				});
		} catch (error) {
			toast.error('Error al obtener las direcciones:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const guardarDireccion = (direccion) => {
		// Aquí envías la dirección al backend
		const fetchCrearPedido = async () => {
			await crearDireccion(direccion, token)
				.then((data) => {
					fetchDirecciones().then(() => {
						seleccionarDireccion(data.id);
					});
				})
				.catch((e) => {
					console.log('Error creando la direccion:' + e);
				}); // Llama al script para cargar las categorías en Redux
		};
		fetchCrearPedido();
	};

	useEffect(() => {
		if (userId) {
			fetchDirecciones();
		}
	}, [step]);

	return (
		<Container>
			<Title>Selecciona una dirección</Title>
			{isLoading ? (
				<p>Cargando direcciones...</p>
			) : (
				<AddressList>
					{direcciones.length > 0 ? (
						direcciones.map((direccion) => (
							<AddressItem
								key={direccion.id}
								onClick={() => seleccionarDireccion(direccion.id)}
								style={{ backgroundColor: direccionId === direccion.id ? '#80b59f' : '#f7f7f7' }}
							>
								{direccion.predeterminado && (
									<StarIcon style={{ color: direccionId === direccion.id ? 'white' : '#f1df00' }} />
								)}
								<div style={{ color: direccionId === direccion.id ? 'white' : 'black' }}>
									<p>{direccion.titulo}</p>
									<p>{direccion.barrio}</p>
									<p>{direccion.direccion}</p>
								</div>
							</AddressItem>
						))
					) : (
						<p>No tienes direcciones registradas.</p>
					)}
					<div tw="mt-4">
						<button
							onClick={() => setMostrarModalDirecciones(true)}
							tw="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
						>
							+ Agregar Dirección
						</button>
					</div>

					{/* Modal para agregar direcciones */}
					<DireccionesModal
						userId={userId}
						mostrarModalDirecciones={mostrarModalDirecciones}
						setMostrarModalDirecciones={setMostrarModalDirecciones}
						onGuardarDireccion={guardarDireccion}
					/>
				</AddressList>
			)}
			<Buttons>
				<SelectButton onClick={() => setStep(2)}>Volver</SelectButton>
				{direccionId > 0 && <NextButton onClick={() => setStep(4)}>Continuar</NextButton>}
			</Buttons>
		</Container>
	);
};

export default AddressSelector;
