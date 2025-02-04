import React from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { FaInstagram } from 'react-icons/fa';
import { AiOutlineMail, AiFillPhone } from 'react-icons/ai';
import acuerdo from '../../images/acuerdo.png';
import transfer from '../../images/transfer.png';
import mercadopago from '../../images/mercadopago.png';
import moto from '../../images/moto.png';
import whatsapp from '../../images/whatsapp.png';

const FooterContainer = tw.footer`bg-white text-gray-700 py-8 shadow-md w-full`;
const Content = tw.div`max-w-screen-xl mx-auto px-8`;
const FlexContainer = tw.div`flex flex-col md:flex-row justify-center items-center md:items-start gap-12 text-center md:text-left`;
const Column = tw.div`flex flex-col items-center md:items-start`;
const ColumnTitle = tw.h5`uppercase font-bold mb-1 text-green-700 border-b-2 border-green-300 pb-1`;
const LinkList = tw.ul`space-y-2 text-sm`;
const LinkItem = tw.li`hover:underline cursor-pointer transition-all hover:text-green-600`;

const ContactInfo = tw.div`space-y-3`;
const ContactItem = tw.div`flex items-center space-x-2 text-sm`;
const Icon = tw.div`text-lg text-green-500`;

const PaymentShipping = tw.div`flex justify-center md:justify-start space-x-3 mt-1 mb-2`;

const IconButton = styled.div`
	${tw`bg-gray-100 w-12 h-12 p-2 rounded-lg flex items-center justify-center shadow-md mb-2`}
	svg {
		${tw`w-8 h-8`}
	}
	img {
		${tw`object-contain flex-shrink-0`}
		max-width: 100%;
		max-height: 100%;
	}
`;

const Copywright = tw.div`text-center text-gray-500 text-sm mt-8`;

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<FooterContainer>
			<Content>
				<FlexContainer>
					{/* TIENDA */}
					<Column>
						<ColumnTitle>TIENDA</ColumnTitle>
						<LinkList>
							<LinkItem>Inicio</LinkItem>
							<LinkItem>Nosotros</LinkItem>
							<LinkItem>Contáctenos</LinkItem>
							<LinkItem>Productos</LinkItem>
						</LinkList>
					</Column>

					{/* CONTACTO */}
					<Column>
						<ColumnTitle>CONTACTO</ColumnTitle>
						<ContactInfo>
							<ContactItem>
								<Icon>
									<AiFillPhone />
								</Icon>
								098576439
							</ContactItem>
							<ContactItem>
								<Icon>
									<AiOutlineMail />
								</Icon>
								lacocinadeemilia65@gmail.com
							</ContactItem>
							<ContactItem>
								<Icon>
									<FaInstagram />
								</Icon>
								la.cocinadeemilia
							</ContactItem>
						</ContactInfo>
					</Column>

					{/* MÉTODOS DE PAGO Y ENVÍO */}
					<Column>
						<ColumnTitle>MÉTODOS DE PAGO</ColumnTitle>
						<PaymentShipping>
							<IconButton>
								<img src={acuerdo} alt="Acuerdo" />
							</IconButton>
							<IconButton>
								<img src={transfer} alt="Transferencia" />
							</IconButton>
							<IconButton>
								<img src={mercadopago} alt="Mercado Pago" />
							</IconButton>
						</PaymentShipping>

						<ColumnTitle>MÉTODOS DE ENVÍO</ColumnTitle>
						<PaymentShipping>
							<IconButton>
								<img src={whatsapp} alt="WhatsApp" />
							</IconButton>
							<IconButton>
								<img src={moto} alt="Envío" />
							</IconButton>
						</PaymentShipping>
					</Column>
				</FlexContainer>

				{/* COPYRIGHT */}
				<Copywright>&copy; {currentYear} La Cocina de Emilia</Copywright>
			</Content>
		</FooterContainer>
	);
};

export default Footer;
