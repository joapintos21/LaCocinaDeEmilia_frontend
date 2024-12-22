import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { ReactComponent as LoginIcon } from 'feather-icons/dist/icons/log-in.svg';
import { iniciarSesion } from 'scripts/loginScript.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from 'store/usuarioSlice'; // Importa la acción login desde el slice
import broadcastService from 'utils/broadcastService';

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
	${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
`;

const LoginComponente = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	useEffect(() => {
		// Muestra un mensaje si la cuenta ha sido verificada
		const params = new URLSearchParams(location.search);
		if (params.get('mensaje') === 'verificado') {
			alert('Cuenta activada con éxito. Por favor, inicia sesión.');
		}
	}, [location]);

	const iniciarSesionEvento = (event) => {
		event.preventDefault();

		iniciarSesion(email, password)
			.then((data) => {
				sessionStorage.setItem('token', data.token);
				// Despacha la acción `login` y almacena el usuario en Redux
				dispatch(login(data.usuario));

				if (broadcastService.channel) {
					broadcastService.sendMessage({
						type: 'TOKEN_ACTUALIZADO',
						token: data.token,
					});
				} else {
					console.warn('El canal ya está cerrado.');
				}
				// Navega a la página principal después del inicio de sesión
				navigate('/');
			})
			.catch((error) => {
				setError(error.message); // Muestra el mensaje de error
			});
	};

	return (
		<Form onSubmit={iniciarSesionEvento}>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
			<Input
				type="password"
				placeholder="Contraseña"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<SubmitButton type="submit">
				<LoginIcon className="icon" />
				<span className="text">Iniciar sesión</span>
			</SubmitButton>
		</Form>
	);
};

export default LoginComponente;
