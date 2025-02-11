import React, { useState } from 'react';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import { Container as ContainerBase } from 'components/misc/Layouts';
import tw from 'twin.macro';
import styled from 'styled-components';
import { css } from 'styled-components/macro';
import illustration from 'images/signup-illustration.svg';
import logo from 'images/logo.svg';
import { ReactComponent as SignUpIcon } from 'feather-icons/dist/icons/user-plus.svg';
import { ReactComponent as EyeIcon } from 'feather-icons/dist/icons/eye.svg';
import { ReactComponent as EyeOffIcon } from 'feather-icons/dist/icons/eye-off.svg';
import { crearUsuario } from 'scripts/signUp';
import { toast } from 'react-toastify';

const Container = tw(ContainerBase)`min-h-screen bg-[#99cdb6] text-white font-medium flex justify-center`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`w-40 h-40 mx-auto rounded-full`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const Form = tw.form`mx-auto max-w-xs`;
const InputContainer = tw.div`relative w-full mt-5`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const EyeButton = tw.button`absolute right-0 inset-y-0 flex items-center px-3`;
const ErrorText = tw.p`text-red-500 text-xs mt-1`;

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

export default function SignUp({
	logoLinkUrl = '/',
	illustrationImageSrc = illustration,
	headingText = 'Registrarse',
	submitButtonText = 'Registrarse',
	SubmitButtonIcon = SignUpIcon,
	signInUrl = 'login',
}) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [nombre, setNombre] = useState('');
	const [telefono, setTelefono] = useState('');
	const [errores, setErrores] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showRepeatPassword, setShowRepeatPassword] = useState(false);
	const rol_id = 4; // Cliente

	const limpiarFormulario = () => {
		setEmail('');
		setPassword('');
		setRepeatPassword('');
		setNombre('');
		setTelefono('');
		setErrores({});
	};

	const handleCreateUser = async (event) => {
		event.preventDefault();

		if (password !== repeatPassword) {
			setErrores({ password: 'Las contraseñas no coinciden.' });
			return;
		}

		crearUsuario(email, password, nombre, telefono, rol_id)
			.then((data) => {
				toast.warn(
					'Usuario creado con éxito. Por favor, vaya a su casilla de correo electrónico para verificar su cuenta.',
				);
				limpiarFormulario();
			})
			.catch((error) => {
				setErrores(error);
				toast.error(error.message); // Asigna el mensaje de error a un estado para mostrarlo
			});
	};

	return (
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
								{/* Nombre */}
								<Input
									type="text"
									placeholder="Nombre completo"
									value={nombre}
									onChange={(e) => setNombre(e.target.value)}
								/>
								{errores.nombre && <ErrorText>{errores.nombre}</ErrorText>}

								{/* Teléfono */}
								<Input
									type="text"
									placeholder="Número de teléfono/celular"
									value={telefono}
									onChange={(e) => setTelefono(e.target.value)}
								/>
								{errores.telefono && <ErrorText>{errores.telefono}</ErrorText>}

								{/* Email */}
								<Input
									type="email"
									placeholder="Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								{errores.email && <ErrorText>{errores.email}</ErrorText>}

								{/* Contraseña */}
								<InputContainer>
									<Input
										type={showPassword ? 'text' : 'password'}
										placeholder="Contraseña"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
									<EyeButton type="button" onClick={() => setShowPassword(!showPassword)}>
										{showPassword ? <EyeOffIcon /> : <EyeIcon />}
									</EyeButton>
								</InputContainer>
								{errores.password && <ErrorText>{errores.password}</ErrorText>}

								{/* Confirmar Contraseña */}
								<InputContainer>
									<Input
										type={showRepeatPassword ? 'text' : 'password'}
										placeholder="Repetir Contraseña"
										value={repeatPassword}
										onChange={(e) => setRepeatPassword(e.target.value)}
									/>
									<EyeButton type="button" onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
										{showRepeatPassword ? <EyeOffIcon /> : <EyeIcon />}
									</EyeButton>
								</InputContainer>
								{errores.password && <ErrorText>{errores.password}</ErrorText>}

								{/* Botón de envío */}
								<SubmitButton type="submit">
									<SubmitButtonIcon className="icon" />
									<span className="text">{submitButtonText}</span>
								</SubmitButton>

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

				{/* ✅ Imagen SVG a la derecha */}
				<IllustrationContainer>
					<IllustrationImage imageSrc={illustrationImageSrc} />
				</IllustrationContainer>
			</Content>
		</Container>
	);
}
