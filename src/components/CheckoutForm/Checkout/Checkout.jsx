import React, {useEffect, useState} from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button,CssBaseline} from "@material-ui/core";
import useStyles from "./styles";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import {commerce} from "../../../lib/commerce";
import { Link, useHistory } from 'react-router-dom';



const steps = ['Shipping address', 'Payment details'];

const Checkout = ({ cart, handleCaptureCheckout, order, error }) => {
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        if (cart.id) {
            const generateToken = async () => {
                try {
                    const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

                    setCheckoutToken(token);
                } catch (error) {
                    // if (activeStep !== steps.length)
                        history.pushState('/');
                }
            };

            generateToken();
        }
    }, [cart]);


    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);


    const test = (data) => {
        setShippingData(data);

        nextStep();
    };

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true)
        }, 3000);
    }

    let Confirmation = () => (order.customer ? (
        <>
            <div>
                <Typography variant="h5">Xaridingiz uchun raxmat, {order.customer.firstname} {order.customer.lastname}!</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle2">Buyurtma ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} variant="outlined" type="button" to="/">Bosh Sahifa</Button>
        </>
    ) : isFinished ? (
        <>
            <div>
                <Typography variant="h5">Xaridingiz uchun raxmat, !</Typography>
                <Divider className={classes.divider} />
            </div>
            <br />
            <Button component={Link} variant="outlined" type="button" to="/">Bosh Sahifa</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    ));
    if (error) {
        Confirmation = () => (
            <>
                <Typography variant="h5">Xato: {error}</Typography>
                <br />
                <Button component={Link} variant="outlined" type="button" to="/">Bosh Sahifa</Button>
            </>
        );
    }
    const Form = () => (activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} nextStep={nextStep} setShippingData={setShippingData} test={test} />
        : <PaymentForm checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData}
                       onCaptureCheckout={handleCaptureCheckout} timeout={timeout}/>);
    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">To'lov</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    );
};
export default Checkout;