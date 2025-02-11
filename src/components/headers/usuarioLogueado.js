import React, { useState } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { logout } from 'store/usuarioSlice';
import { useNavigate } from 'react-router-dom';

const DropdownContainer = styled.div`
	${tw`relative inline-block`}
`;

const DropdownButton = styled.button`
	${tw`flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-primary-500`}
`;

const DropdownMenu = styled.div`
	${tw`absolute right-0 z-10 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5`}
`;

const DropdownItem = styled.a`
	${tw`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer`}
`;

const DropdownDivider = styled.div`
	${tw`border-t border-gray-200`}
`;

const UserDropdown = ({ userName, userRol }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const toggleDropdown = () => {
		setIsOpen((prev) => !prev);
	};

	const handleLogout = () => {
		dispatch(logout());
		navigate('/login');
	};

	return (
		<DropdownContainer>
			<DropdownButton onClick={toggleDropdown}>{userName}</DropdownButton>
			{isOpen && (
				<DropdownMenu>
					{(userRol === 1 || userRol === 4 || userRol === 5) && (
						<>
							<DropdownItem onClick={() => navigate('/perfil')}>Perfil</DropdownItem>
							<DropdownItem onClick={() => navigate('/mis_pedidos')}>Mis Pedidos</DropdownItem>
						</>
					)}
					<DropdownDivider />
					<DropdownItem onClick={handleLogout}>Cerrar Sesión</DropdownItem>
				</DropdownMenu>
			)}
		</DropdownContainer>
	);
};

export default UserDropdown;
