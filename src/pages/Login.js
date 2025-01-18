import React from 'react';
import { Container as ContainerBase } from 'components/misc/Layouts';
import tw from 'twin.macro';
import styled from 'styled-components';
import { css } from 'styled-components/macro'; //eslint-disable-line
import illustration from 'images/login-illustration.svg';
import logo from 'images/logo.svg';
import LoginComponent from 'components/login/LoginComponent.js';

const Container = tw(ContainerBase)`min-h-screen bg-[#99cdb6] text-white font-medium flex justify-center`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`w-40 h-40 mx-auto rounded-full`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
	${(props) => `background-image: url("${props.imageSrc}");`}
	${tw`m-12 xl:m-16 w-full max-w-sm bg-contain bg-center bg-no-repeat`}
`;

export default ({
	logoLinkUrl = '/',
	illustrationImageSrc = illustration,
	headingText = 'Inicia sesión',
	forgotPasswordUrl = 'forgot-password',
	signupUrl = 'signup',
}) => (
	<Container>
		<Content>
			<MainContainer>
				<LogoLink href={logoLinkUrl}>
					<LogoImage src={logo} />
				</LogoLink>
				<MainContent>
					<Heading>{headingText}</Heading>
					<FormContainer>
						<LoginComponent />
						<p tw="mt-6 text-xs text-gray-600 text-center">
							<a href={forgotPasswordUrl} tw="border-b border-gray-500 border-dotted">
								¿Olvidaste la contraseña?
							</a>
						</p>
						<p tw="mt-8 text-sm text-gray-600 text-center">
							¿Todavia no tienes una cuenta?{' '}
							<a href={signupUrl} tw="border-b border-gray-500 border-dotted">
								Registrarse
							</a>
						</p>
					</FormContainer>
				</MainContent>
			</MainContainer>
			<IllustrationContainer>
				<IllustrationImage imageSrc={illustrationImageSrc} />
			</IllustrationContainer>
		</Content>
	</Container>
);
