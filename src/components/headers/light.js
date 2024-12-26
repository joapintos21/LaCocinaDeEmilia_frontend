import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import tw from 'twin.macro';
import styled from 'styled-components';
import { css } from 'styled-components/macro'; //eslint-disable-line
import useAnimatedNavToggler from '../../helpers/useAnimatedNavToggler.js';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Cart from 'components/Cart/Cart.js';
import logo from '../../images/logo.svg';
import { ReactComponent as MenuIcon } from 'feather-icons/dist/icons/menu.svg';
import { ReactComponent as CloseIcon } from 'feather-icons/dist/icons/x.svg';
import { useDispatch, useSelector } from 'react-redux';
import { quitarItem } from 'store/carritoSlice';
import { useNavigate } from 'react-router-dom';
import UserDropdown from './usuarioLogueado.js';
import { handleQuitarDeCarrito } from 'utils/carritoUtils.js';
import broadcastService from 'utils/broadcastService.js';

const Header = tw.header`
  flex justify-between items-center
  max-w-screen-xl mx-auto
`;

export const NavLinks = tw.div`inline-block`;
export const NavLink = tw.a`
  text-lg my-2 lg:text-sm lg:mx-6 lg:my-0
  font-semibold tracking-wide transition duration-300
  pb-1 border-b-2 border-transparent hover:border-primary-500 hocus:text-primary-500
`;
export const PrimaryLink = tw(NavLink)`
  lg:mx-0
  px-8 py-3 rounded bg-[#99cdb6] text-gray-100
  hocus:bg-[#79bda0] hocus:text-gray-200 focus:shadow-outline
  border-b-0
`;
export const LogoLink = styled(NavLink)`
	${tw`flex items-center font-black border-b-0 text-2xl! ml-0!`};
	img {
		width: 10rem;
		height: 10rem;
		${tw`mr-3 rounded-full`}
	}
`;

export const MobileNavLinksContainer = tw.nav`flex flex-1 items-center justify-between`;
export const NavToggle = tw.button`
  lg:hidden z-20 focus:outline-none hocus:text-primary-500 transition duration-300
`;
export const MobileNavLinks = motion(styled.div`
	${tw`lg:hidden z-10 fixed top-0 inset-x-0 mx-4 my-6 p-8 border text-center rounded-lg text-gray-900 bg-white`}
	${NavLinks} {
		${tw`flex flex-col items-center`}
	}
`);
export const DesktopNavLinks = tw.nav`
  hidden lg:flex flex-1 justify-between items-center
`;

export default ({ roundedHeaderButton = false, logoLink, links, className, collapseBreakpointClass = 'lg' }) => {
	const [cartAnchorEl, setCartAnchorEl] = useState(null);
	const { showNavLinks, animation, toggleNavbar } = useAnimatedNavToggler();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Obtener información del usuario y carrito desde Redux
	const userInfo = useSelector((state) => state.usuario.userInfo);
	const cartItems = useSelector((state) => state.carrito.items);
	const totalPrice = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
	const token = sessionStorage.getItem('token');

	// Manejo de carrito
	const handleCartOpen = (event) => setCartAnchorEl(event.currentTarget);
	const handleCartClose = () => setCartAnchorEl(null);

	const handleQuitarCarrito = (item) => {
		handleQuitarDeCarrito(userInfo.id, item.id, item.cantidad, item.tipo, token);
		dispatch(quitarItem(item));
	};

	useEffect(() => {
		if (broadcastService.channel) {
			// Escucha los mensajes del canal
			broadcastService.onMessage((data) => {
				if (data.type === 'TOKEN_ACTUALIZADO') {
					sessionStorage.setItem('token', data.token);
					console.log('Token sincronizado:', data.token);
				}
			});
		}

		// Limpieza al desmontar el componente
		return () => {
			broadcastService.closeChannel();
		};
	}, []);

	const defaultLogoLink = (
		<LogoLink href="/">
			<img src={logo} alt="logo" />
		</LogoLink>
	);

	const defaultLinks = [
		<NavLinks key={1}>
			{userInfo && userInfo.rol === 'Administrador' && <NavLink href="/paneladministrador">Panel</NavLink>}
			<NavLink href="/panelcocineras">Cocineras</NavLink>
			<NavLink href="/panelcadetes">Cadetes</NavLink>
			<NavLink href="/nosotros">Nosotros</NavLink>
			<NavLink href="/pricing">Pricing</NavLink>
			<NavLink href="/contacto">Contactenos</NavLink>
			<NavLink href="/productos">Productos</NavLink>
			<IconButton onClick={handleCartOpen}>
				<ShoppingCartIcon />
			</IconButton>
			{userInfo ? (
				<>{userInfo && <UserDropdown userName={userInfo.nombre} />}</>
			) : (
				<>
					<NavLink href="/login">Iniciar sesión</NavLink>
					<PrimaryLink css={roundedHeaderButton && tw`rounded-full`} href="/signup">
						Registrarse
					</PrimaryLink>
				</>
			)}
		</NavLinks>,
	];

	logoLink = logoLink || defaultLogoLink;
	links = links || defaultLinks;

	return (
		<Header className={className || 'header-light'}>
			<DesktopNavLinks css={collapseBreakPointCssMap[collapseBreakpointClass].desktopNavLinks}>
				{logoLink}
				{links}
			</DesktopNavLinks>

			<MobileNavLinksContainer css={collapseBreakPointCssMap[collapseBreakpointClass].mobileNavLinksContainer}>
				{logoLink}
				<MobileNavLinks
					initial={{ x: '150%', display: 'none' }}
					animate={animation}
					css={collapseBreakPointCssMap[collapseBreakpointClass].mobileNavLinks}
				>
					{links}
				</MobileNavLinks>
				<NavToggle onClick={toggleNavbar} className={showNavLinks ? 'open' : 'closed'}>
					{showNavLinks ? <CloseIcon tw="w-6 h-6" /> : <MenuIcon tw="w-6 h-6" />}
				</NavToggle>
			</MobileNavLinksContainer>

			<Cart
				anchorEl={cartAnchorEl}
				close={handleCartClose}
				dataCart={cartItems}
				removeItem={handleQuitarCarrito}
				totalPrice={totalPrice}
				checkout={() => navigate('/carrito')}
			/>
		</Header>
	);
};

/* Ajuste de puntos de interrupción */
const collapseBreakPointCssMap = {
	sm: { mobileNavLinks: tw`sm:hidden`, desktopNavLinks: tw`sm:flex`, mobileNavLinksContainer: tw`sm:hidden` },
	md: { mobileNavLinks: tw`md:hidden`, desktopNavLinks: tw`md:flex`, mobileNavLinksContainer: tw`md:hidden` },
	lg: { mobileNavLinks: tw`lg:hidden`, desktopNavLinks: tw`lg:flex`, mobileNavLinksContainer: tw`lg:hidden` },
	xl: { mobileNavLinks: tw`lg:hidden`, desktopNavLinks: tw`lg:flex`, mobileNavLinksContainer: tw`lg:hidden` },
};
