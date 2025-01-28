import React from 'react';
import PropTypes from 'prop-types';
import tw from 'twin.macro';
import { SpinnerCircular } from 'spinners-react';

const Spinner = ({ text, size, thickness, speed, color, secondaryColor, overlay, overlayOpacity }) => {
	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: overlay ? `rgba(255, 255, 255, ${overlayOpacity})` : 'transparent',
				zIndex: 50,
			}}
		>
			<SpinnerCircular
				size={size}
				thickness={thickness}
				speed={speed}
				color={color}
				secondaryColor={secondaryColor}
			/>
			{text && <p tw="mt-4 text-gray-600">{text}</p>}
		</div>
	);
};

Spinner.propTypes = {
	text: PropTypes.string, // Texto opcional para mostrar debajo del spinner
	size: PropTypes.number, // Tamaño del spinner
	thickness: PropTypes.number, // Grosor del spinner
	speed: PropTypes.number, // Velocidad del spinner
	color: PropTypes.string, // Color principal
	secondaryColor: PropTypes.string, // Color secundario
	overlay: PropTypes.bool, // Indica si debe mostrarse como overlay
	overlayOpacity: PropTypes.number, // Opacidad del overlay
};

Spinner.defaultProps = {
	text: '', // Por defecto no muestra texto
	size: 50, // Tamaño por defecto
	thickness: 100, // Grosor por defecto
	speed: 100, // Velocidad por defecto
	color: '#4A90E2', // Color principal
	secondaryColor: '#F3F3F3', // Color secundario
	overlay: true, // Por defecto no es un overlay
	overlayOpacity: 0.85, // Opacidad por defecto
};

export default Spinner;
