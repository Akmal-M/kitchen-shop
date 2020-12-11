import React from 'react';
import {Container, Typography,Button,Grid} from "@material-ui/core";
import {Link} from 'react-router-dom';
import useStyles from "./styles";
import CartItem from "./CartItems/CartItem";


const Cart = ({cart, handleEmptyCart, handleRemoveFromCart, handleUpdateCartQuantity}) => {
    const classes = useStyles();


    const EmptyCart = () => (
        <Typography variant="subtitle1">Hech qanday tovar tanlanmadi,
        <Link to='/' className={classes.link}>tovarni tanlang</Link>!
        </Typography>
    )

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem item={item} handleUpdateCartQuantity={handleUpdateCartQuantity} handleRemoveFromCart={handleRemoveFromCart}/>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">Hammasi: {cart.subtotal.formatted_with_symbol}</Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Hammasini o'chirish </Button>
                    <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary" >To'lov </Button>
                </div>
            </div>
        </>
    )

    if(!cart.line_items) return 'Loading...';
    return (
        <Container>
            <div className={classes.toolbar}/>
            <Typography className={classes.title} variant="h3" gutterBottom>Tovarlar ro'yxati </Typography>
            { !cart.line_items.length ? <EmptyCart /> : <FilledCart />}
        </Container>
    );
};

export default Cart;