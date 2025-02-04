import React, { useState } from 'react';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import Footer from 'components/footers/FiveColumnWithInputForm.js';
import MapComponent from '../components/Cart/MapComponent';
import tw from 'twin.macro';

export default () => {
	const Title = tw.h2`text-2xl font-bold text-left mb-8`;

	const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
	const handleDireccionSeleccionada = ({ direccion, coordenadas }) => {
		setDireccionSeleccionada({ direccion, coordenadas });
	};

	return (
		<AnimationRevealPage>
			<Title> ENVÍOS </Title>
			Los envíos se realizan de lunes a viernes en horario de 19 a 21hs. 
			<br />
			Al realizar la compra web nosotros nos estaremos comunicando contigo para coordinar el envío y forma de pago!
			<br />
			<MapComponent  onDireccionSeleccionada={handleDireccionSeleccionada} />
			<Footer />
		</AnimationRevealPage>
	);
};
