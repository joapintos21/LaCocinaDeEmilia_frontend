// components/cart/ShippingScheduler.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import tw from 'twin.macro';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Container = tw.div`flex flex-col w-full`;
const ContainerDatePicker = tw.div`flex flex-col w-full items-center`;
const Title = tw.h2`text-2xl font-bold mb-4 self-start`;
const InfoText = tw.p`text-sm text-gray-600 mt-2`;
const Buttons = tw.div`flex justify-between`;
const SelectButton = tw.button`mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 self-start`;
const NextButton = tw.button`mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 self-end`;

const PickUpScheduler = ({ setStep, fechaSeleccionada, setFechaSeleccionada }) => {
	const [fechasOcupadas, setFechasOcupadas] = useState([]);

	useEffect(() => {
		const fetchFechasOcupadas = async () => {
			try {
				const response = await fetch('/api/fechas-ocupadas');
				const data = await response.json();
				setFechasOcupadas(data.fechas);
			} catch (error) {
				console.error('Error al obtener fechas ocupadas:', error);
			}
		};
		fetchFechasOcupadas();
	}, []);

	const isDateDisabled = (date) => {
		const formattedDate = format(date, 'yyyy-MM-dd');
		return fechasOcupadas.includes(formattedDate);
	};

	return (
		<Container>
			<Title>Selecciona la fecha de retiro</Title>
			<ContainerDatePicker>
				<DatePicker
					selected={fechaSeleccionada}
					onChange={(date) => setFechaSeleccionada(date)}
					minDate={new Date()}
					filterDate={(date) => !isDateDisabled(date)}
					inline
					locale={es}
					dateFormat="dd/MM/yyyy"
				/>
				{fechaSeleccionada && (
					<InfoText>Fecha seleccionada: {format(fechaSeleccionada, 'dd/MM/yyyy', { locale: es })}</InfoText>
				)}
			</ContainerDatePicker>
			<Buttons>
				<SelectButton onClick={() => setStep(2)}>Volver</SelectButton>
				<NextButton onClick={() => setStep(4)}>Continuar</NextButton>
			</Buttons>
		</Container>
	);
};

export default PickUpScheduler;
