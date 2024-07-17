import "./Payment.css"
import { useEffect, useRef } from "react"
import CheckoutSteps from "./CheckoutSteps"
import { useSelector, useDispatch } from "react-redux"
import { useAlert } from "react-alert"
import { useNavigate } from "react-router-dom"
import { Typography } from "@mui/material"
import {
    CardNumberElement, 
    CardCvcElement, 
    CardExpiryElement, 
    useStripe,
    useElements  } from "@stripe/react-stripe-js"
import axios from "axios"
import { CreditCard,Event,VpnKey } from "@mui/icons-material"
import Loader from "../Loader/Loader"
import { createOrder,clearErrors } from "../../src/redux-store/actions/orderAction"


function Payment()
{
    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const stripe = useStripe()
    const elements = useElements()
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"))
    const {loading : userLoading ,isAuthenticated,user} = useSelector((state)=>{
        return state.user
    })
    //this page won't be available if user is not logged in, because if that's
    //the case then we won't have stripeApiKey resulting in this page not getting 
    //loaded.
    //but still we are doing this for safe measures.
    const {cartItems,shippingInfo} = useSelector((state)=>{
        return state.cart
    })
    const {error} = useSelector((state)=>{
        return state.newOrder
    })
    useEffect(()=>{
        if((userLoading == false)&&(isAuthenticated == false))
        {
            navigate("/login?redirect=shipping")
        }
    },[isAuthenticated,userLoading])
    useEffect(()=>{
        if(cartItems.length == 0)
        {
            alert.error("Cart is empty")
            navigate("/shoppingCart")
            return
        }
        //flag will have true or false based on whether all the shipping details are there or not
        let flag = (shippingInfo.address)&&(shippingInfo.city)&&(shippingInfo.country)&&(shippingInfo.phoneNo)&&(shippingInfo.pincode)&&(shippingInfo.state)
        if(!flag)
        {
            alert.error("Shipping Details are invalid. Please fill them out")
            navigate("/shipping")
            return
        }
    },[cartItems,shippingInfo])
    useEffect(()=>{
        if(!orderInfo){
            alert.error("Details are invalid. Confirm your order first")
            navigate("/order/confirm")
            return
        }
    },[orderInfo])

    const paymentData = {amount : Math.round(orderInfo.totalPrice * 100)}
    const order = {
        shippingInfo,
        orderItems : cartItems,
        paymentInfo : {

        },
        itemsPrice : orderInfo.itemsPrice,
        taxPrice : orderInfo.taxPrice,
        shippingPrice : orderInfo.shippingPrice,
        totalPrice : orderInfo.totalPrice
    }

    const payBtn = useRef(null)
    const submitHandler = async (e) => {
        e.preventDefault()
        payBtn.current.disabled = true
        try {
            const config = {
                headers: {
                    "Content-Type" : "application/json"
                },
                withCredentials : true
            }
            const {data} = await axios.post(
                "http://localhost:3000/api/v1/payment/process",
                paymentData,
                config
            )
            const client_secret = data.client_secret
            if(!stripe || !elements){
                return
            }
            const result = await stripe.confirmCardPayment(
                client_secret,
                {
                    payment_method: {
                        card : elements.getElement(CardNumberElement),
                        billing_details : {
                            name : user.name,
                            email : user.email,
                            address : {
                                line1: shippingInfo.address,
                                city : shippingInfo.city,
                                state : shippingInfo.state,
                                postal_code : shippingInfo.pincode,
                                country : shippingInfo.country
                            }
                        }
                    }
                }
            )
            if(result.error)
            {
                payBtn.current.disabled = false
                alert.error(result.error.message)
            }
            else
            {
                if(result.paymentIntent.status == "succeeded")
                {
                    order.paymentInfo = {
                        id : result.paymentIntent.id,
                        status : result.paymentIntent.status
                    }
                    await dispatch(createOrder(order))
                    navigate("/success")
                }
                else
                {
                    payBtn.current.disabled = false
                    alert.error("There's some issue while processing payment")
                }
            }
        } catch (error) {
            payBtn.current.disabled = false
            alert.error(error.response.data.message)
        }
    }

    useEffect(()=>{
        if(error)
        {
            alert.error(error)
            alert.error("If amount is deducted it will be refunded within few days")
            dispatch(clearErrors())
        }
    },[error])



    if(userLoading)
    {
        return (
            <>
            <div className="loadingScreen">
                <Loader/>
            </div>
            </>
        )
    }
    return (
        <>
        <CheckoutSteps activeStep={2}/>
        <div className="paymentContainer">
            <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
                <Typography>Card Info</Typography>
                <div>
                    <CreditCard/>
                    <CardNumberElement className="paymentInput" />
                </div>
                <div>
                    <Event/>
                    <CardExpiryElement className="paymentInput" />
                </div>
                <div>
                    <VpnKey/>
                    <CardCvcElement className="paymentInput" />
                </div>
                <input 
                type="submit"
                value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                ref={payBtn}
                className="paymentFormBtn"/>
            </form>
        </div>
        </>
    )
}



export default Payment