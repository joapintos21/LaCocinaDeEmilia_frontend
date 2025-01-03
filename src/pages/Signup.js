import React, { useState } from 'react';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import { Container as ContainerBase } from 'components/misc/Layouts';
import tw from 'twin.macro';
import styled from 'styled-components';
import { css } from 'styled-components/macro'; //eslint-disable-line
import illustration from 'images/signup-illustration.svg';
import logo from 'images/logo.svg';
import { ReactComponent as SignUpIcon } from 'feather-icons/dist/icons/user-plus.svg';
import { crearUsuario } from 'scripts/signUp';
import { toast } from 'react-toastify';

const Container = tw(ContainerBase)`min-h-screen bg-[#99cdb6] text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`w-40 h-40 mx-auto rounded-full`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
	${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
	.icon {
		${tw`w-6 h-6 -ml-2`}
	}
	.text {
		${tw`ml-3`}
	}
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
	${(props) => `background-image: url("${props.imageSrc}");`}
	${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;

export default ({
	logoLinkUrl = '/',
	illustrationImageSrc = illustration,
	headingText = 'Registrarse',
	submitButtonText = 'Registrarse',
	SubmitButtonIcon = SignUpIcon,
	tosUrl = '#',
	privacyPolicyUrl = '#',
	signInUrl = 'login',
}) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [nombre, setNombre] = useState('');
	const [telefono, setTelefono] = useState('');
	const [error, setError] = useState('');
	const rol_id = 4; //Cliente

	const limpiarFormulario = () => {
		setEmail('');
		setPassword('');
		setNombre('');
		setTelefono('');
		setError('');
	};

	const handleCreateUser = (event) => {
		event.preventDefault();
		crearUsuario(email, password, nombre, telefono, rol_id)
			.then((data) => {
				toast.warn(
					'Usuario creado con éxito. Por favor, vaya a su casilla de correo electrónico para verificar su cuenta.',
				);
				limpiarFormulario();
			})
			.catch((error) => {
				console.error('Error al crear el usuario:', error.message);
				setError(error.message); // Asigna el mensaje de error a un estado para mostrarlo
			});
	};

	return (
		<AnimationRevealPage>
			<Container>
				<Content>
					<MainContainer>
						<LogoLink href={logoLinkUrl}>
							<LogoImage src={logo} />
						</LogoLink>
						<MainContent>
							<Heading>{headingText}</Heading>
							<FormContainer>
								<Form onSubmit={handleCreateUser}>
									<Input
										type="text"
										placeholder="Nombre completo"
										value={nombre}
										onChange={(e) => setNombre(e.target.value)}
									/>
									<Input
										type="text"
										placeholder="Numero de teléfono/celular"
										value={telefono}
										onChange={(e) => setTelefono(e.target.value)}
									/>
									<Input
										type="email"
										placeholder="Email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
									<Input
										type="password"
										placeholder="Contraseña"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
									<SubmitButton type="submit">
										<SubmitButtonIcon className="icon" />
										<span className="text">{submitButtonText}</span>
									</SubmitButton>
									{error && (
										<p style={{ color: 'red' }} tw="mt-5 text-center">
											{error}
										</p>
									)}
									<p tw="mt-6 text-xs text-gray-600 text-center">
										Al registrarse, acepta los{' '}
										<a href={tosUrl} tw="border-b border-gray-500 border-dotted">
											Términos de servicio
										</a>{' '}
										y la{' '}
										<a href={privacyPolicyUrl} tw="border-b border-gray-500 border-dotted">
											Política de privacidad
										</a>
										.
									</p>

									<p tw="mt-8 text-sm text-gray-600 text-center">
										¿Ya tienes una cuenta?{' '}
										<a href={signInUrl} tw="border-b border-gray-500 border-dotted">
											Iniciar sesión
										</a>
									</p>
								</Form>
							</FormContainer>
						</MainContent>
					</MainContainer>
					<IllustrationContainer>
						<IllustrationImage imageSrc={illustrationImageSrc} />
					</IllustrationContainer>
				</Content>
			</Container>
		</AnimationRevealPage>
	);
};
