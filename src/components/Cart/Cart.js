import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { withStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import styles from './cart-jss';

class Cart extends React.Component {
  render() {
    const {
      classes,
      anchorEl,
      close,
      dataCart = [],
      removeItem,
      totalPrice,
      checkout
    } = this.props;

    const getCartItem = dataArray => dataArray.map((item, index) => (
      <Fragment key={index.toString()}>
        <ListItem>
          <figure>
            <img src={item.thumbnail} alt="thumb" />
          </figure>
          <ListItemText
            primary={item.name}
            secondary={`Quantity: ${item.quantity} Item - USD ${item.price * item.quantity}`}
            className={classes.itemText}
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Comments" onClick={() => removeItem(item)}>
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
        className={classes.cartPanel}
      >
        <List
          component="ul"
          subheader={<ListSubheader component="div"><ShoppingCartIcon /> Total: {dataCart.length} productos en el carrito </ListSubheader>}
          className={classes.cartWrap}
        >
          {
            dataCart.length < 1 ? (
              <div className={classes.empty}>
                <Typography variant="subtitle1">Carrito vacío</Typography>
                <Typography variant="caption">Tus productos aparecerán aquí</Typography>
              </div>
            ) : (
              <Fragment>
                {getCartItem(dataCart)}
                <ListItem className={classes.totalPrice}>
                  <Typography variant="subtitle1">
                    Total: <span>${totalPrice}</span>
                  </Typography>
                </ListItem>
                <li>
                  <Divider />
                </li>
                <ListItem>
                  <Button fullWidth className={classes.button} onClick={() => checkout()} color="secondary">
                    Checkout
                  </Button>
                </ListItem>
              </Fragment>
            )
          }
        </List>
      </Menu>
    );
  }
}

Cart.propTypes = {
  classes: PropTypes.object.isRequired,
  dataCart: PropTypes.array.isRequired,
  anchorEl: PropTypes.object,
  close: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  checkout: PropTypes.func.isRequired,
  totalPrice: PropTypes.number.isRequired,
};

Cart.defaultProps = {
  anchorEl: null,
  dataCart: [],
};

export default withStyles(styles)(Cart);