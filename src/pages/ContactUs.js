import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import tw from 'twin.macro';
import styled from 'styled-components';
import Footer from 'components/footers/FiveColumnWithInputForm.js';
import ContactUsForm from 'components/forms/TwoColContactUsWithIllustrationFullForm.js';
import React, { useEffect } from 'react';
import FAQ from 'components/faqs/SingleCol.js';
import { useDispatch, useSelector } from 'react-redux';
import { obtenerEmpresa } from '../scripts/obtenerEmpresa';

const ContactSection = tw.div`py-8 px-4 bg-gray-100 text-gray-900`;
const ContactContainer = tw.div`max-w-screen-xl mx-auto`;
const Title = tw.h2`text-2xl font-bold text-center mb-8`;
const InfoGrid = styled.div`
	${tw`flex flex-wrap justify-center gap-8`}
`;
const InfoCard = styled.div`
	${tw`p-4 bg-white rounded-lg shadow-lg flex flex-col items-center text-center`}
	h3 {
		${tw`text-lg font-semibold mt-4`}
	}
	p {
		${tw`text-sm mt-2 text-gray-600`}
	}
`;
const IconWrapper = tw.div`p-4 bg-primary-500 text-white rounded-full`;

export default () => {
	const HighlightedText = tw.span`bg-[#99cdb6] text-gray-100 px-4 transform -skew-x-12 inline-block`;
	const dispatch = useDispatch();
	const fetchEmpresa = async () => {
		try {
			await obtenerEmpresa(dispatch, sessionStorage.getItem('token'));
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		fetchEmpresa();
	}, []);
	const empresa = useSelector((state) => state.empresa || {});

	return (
		<AnimationRevealPage>
			{empresa && (empresa.direccion?.trim() || empresa.correo?.trim() || empresa.telefono?.trim()) && (
				<ContactSection>
					<ContactContainer>
						<Title>
							<HighlightedText> Datos de Contacto </HighlightedText>
						</Title>
						<InfoGrid>
							{empresa.direccion?.trim() && (
								<InfoCard>
									<IconWrapper>
										<span role="img" aria-label="address">
											📍
										</span>
									</IconWrapper>
									<h3>Dirección</h3>
									<p>{empresa.direccion}</p>
								</InfoCard>
							)}
							{empresa.correo?.trim() && (
								<InfoCard>
									<IconWrapper>
										<span role="img" aria-label="email">
											✉️
										</span>
									</IconWrapper>
									<h3>Correo Electrónico</h3>
									<p>{empresa.correo}</p>
								</InfoCard>
							)}
							{empresa.telefono?.trim() && (
								<InfoCard>
									<IconWrapper>
										<span role="img" aria-label="phone">
											📞
										</span>
									</IconWrapper>
									<h3>Teléfono</h3>
									<p>{empresa.telefono}</p>
								</InfoCard>
							)}
						</InfoGrid>
					</ContactContainer>
				</ContactSection>
			)}
			
			<ContactUsForm />
			<FAQ />
			<Footer />
		</AnimationRevealPage>
	);
};
