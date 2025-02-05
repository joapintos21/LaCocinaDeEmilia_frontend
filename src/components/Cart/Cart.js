import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Cart = ({ anchorEl, close, dataCart = [], removeItem, totalPrice, checkout }) => {
	const theme = useTheme(); // ✅ Usa el theme correctamente

	const getCartItem = (dataArray) =>
		dataArray.map((item, index) => (
			<Fragment key={index.toString()}>
				<ListItem>
					<figure>
						<img src={item.thumbnail} alt="thumb" style={{ width: 50, height: 50 }} />
					</figure>
					<ListItemText
						primary={item.descripcion}
						secondary={
							<>
								<span>
									Cantidad: {item.cantidad} Item - ${item.precioTotal}
								</span>
								{item.adicional && (
									<Typography
										variant="body2"
										sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}
									>
										Adicional: {item.adicional.descripcion} (+${item.adicional.costoAdicional})
									</Typography>
								)}
							</>
						}
						sx={{ marginLeft: theme.spacing(2) }}
					/>
					<ListItemSecondaryAction>
						<IconButton aria-label="Delete" onClick={() => removeItem(item)}>
							<DeleteIcon />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
				<li>
					<Divider />
				</li>
			</Fragment>
		));

	return (
		<Menu
			id="cart-menu"
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={Boolean(anchorEl)}
			onClose={close}
			sx={{ minWidth: 300 }} // ✅ Corrige el error de estilos
		>
			<List
				component="ul"
				subheader={
					<ListSubheader component="div">
						<ShoppingCartIcon /> Total: {dataCart.length} productos en el carrito
					</ListSubheader>
				}
				sx={{ maxHeight: 400, overflowY: 'auto' }} // ✅ Se usa `sx` en lugar de clases obsoletas
			>
				{dataCart.length < 1 ? (
					<div style={{ textAlign: 'center', padding: theme.spacing(2) }}>
						<Typography variant="subtitle1">Carrito vacío</Typography>
						<Typography variant="caption">Tus productos aparecerán aquí</Typography>
					</div>
				) : (
					<Fragment>
						{getCartItem(dataCart)}
						<ListItem sx={{ fontWeight: 'bold' }}>
							<Typography variant="subtitle1">
								Total: <span>${totalPrice}</span>
							</Typography>
						</ListItem>
						<li>
							<Divider />
						</li>
						<ListItem>
							<Button fullWidth sx={{ marginTop: theme.spacing(1) }} onClick={checkout} color="secondary">
								Checkout
							</Button>
						</ListItem>
					</Fragment>
				)}
			</List>
		</Menu>
	);
};

Cart.propTypes = {
	anchorEl: PropTypes.object,
	close: PropTypes.func.isRequired,
	dataCart: PropTypes.array.isRequired,
	removeItem: PropTypes.func.isRequired,
	checkout: PropTypes.func.isRequired,
	totalPrice: PropTypes.number.isRequired,
};

Cart.defaultProps = {
	anchorEl: null,
	dataCart: [],
};

export default Cart;
