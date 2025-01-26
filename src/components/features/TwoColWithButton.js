import React from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { SectionHeading, Subheading as SubheadingBase } from 'components/misc/Headings.js';

const Container = tw.div`relative px-4 sm:px-8 md:px-16 lg:px-24`; // Añadido padding horizontal
const TwoColumn = tw.div`flex flex-col justify-between max-w-screen-xl mx-auto py-20 md:py-24 items-center`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const TextColumn = styled(Column)((props) => [
	tw`mt-16 md:mt-0 text-center`,
	props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`,
]);

const TextContent = tw.div`lg:py-8 w-full`;

const Subheading = tw(SubheadingBase)`text-center`;
const Heading = tw(
	SectionHeading,
)`mt-4 font-black text-center text-3xl sm:text-4xl lg:text-5xl leading-tight`;
const Description = tw.p`mt-4 text-center text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

export default ({
	subheading = '',
	heading = '',
	description = (
		<>
			¡Bienvenidos a nuestra página web! Somos un emprendimiento familiar que busca ofrecer opciones deliciosas y saludables. <br /><br />
			Te cuento un poco sobre nosotras... mi madre es Emilia, quien se encarga de cocinar. Ha realizado varios cursos de cocina y es lo que ama hacer! No es porque sea mi madre, pero creo que es la mejor en lo que hace. Por otro lado, yo, me llamo Sofi y me encargo de toda la parte de Marketing y de los envíos:). Actualmente estoy en tercer año de nutrición, por lo que esto hace que me interese por demás que todo sea nutritivo. <br /><br />
			En nuestra página encontrarás varias opciones saludables, además, si tienes alguna preferencia o deseas realizar cualquier cambio en el producto, puedes consultar sin problema. Haremos lo posible para adaptarnos a tus preferencias. <br /><br />
			Nos apasiona lo que hacemos y nos esforzamos por brindarte la mejor experiencia posible. ¡Gracias por visitar nuestra página web y esperamos tener el gusto de cocinar para ti!
		</>
	),
	textOnLeft = true,
}) => {
	return (
		<Container>
			<TwoColumn>
				<TextColumn textOnLeft={textOnLeft}>
					<TextContent>
						<Subheading>{subheading}</Subheading>
						<Heading>{heading}</Heading>
						<Description>{description}</Description>
					</TextContent>
				</TextColumn>
			</TwoColumn>
		</Container>
	);
};
