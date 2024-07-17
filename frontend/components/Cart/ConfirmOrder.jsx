import "./ConfirmOrder.css"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useAlert } from "react-alert"
import Loader from "../Loader/Loader"
import CheckoutSteps from "./CheckoutSteps"
import { Typography } from "@mui/material"


function ConfirmOrder()
{
    const alert = useAlert()
    const navigate = useNavigate()
    const {loading : userLoading ,isAuthenticated,user} = useSelector((state)=>{
        return state.user
    })
    const {cartItems,shippingInfo} = useSelector((state)=>{
        return state.cart
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
    var subtotal = 0
    var shippingCharges = 0
    var tax = 0
    var totalPrice = 0
    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pincode}, ${shippingInfo.country}`
    
    const confirmOrderSubmit = () => {
        const data = {
            itemsPrice : subtotal,
            shippingPrice : shippingCharges,
            taxPrice : tax,
            totalPrice : totalPrice
        }
        sessionStorage.setItem("orderInfo",JSON.stringify(data))
        navigate("/process/payment")
    }



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
        <CheckoutSteps activeStep={1} />
        <div className="confirmOrderPage">
            <div>
                <div className="confirmShippingArea">
                    <Typography>Shipping Info</Typography>
                    <div className="confirmShippingAreaBox">
                        <div>
                            <p>Name: </p>
                            <span>{user && user.name}</span>
                        </div>
                        <div>
                            <p>Phone: </p>
                            <span>{shippingInfo.phoneNo}</span>
                        </div>
                        <div>
                            <p>Address: </p>
                            <span>{address}</span>
                        </div>
                    </div>
                </div>
                <div className="confirmCartItems">
                    <Typography>Your Cart Items:</Typography>
                    <div className="confirmCartItemsContainer">
                        {cartItems && cartItems.map((item)=>{
                            subtotal += item.price * item.quantity
                            shippingCharges = (subtotal > 1000) ? 0 : 200
                            tax = subtotal * 0.18
                            totalPrice = subtotal + shippingCharges + tax
                            return (
                                <div key={item.product}>
                                    <img src={item.image} alt={item.name}/>
                                    <p>{item.name}</p>
                                    {" "}
                                    <span>{`Price: ₹${item.price} X ${item.quantity} = ₹${item.price * item.quantity}`}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            {/**/}
            <div>
                <div className="orderSummary">
                    <Typography>Order Summary</Typography>
                    <div>
                        <div>
                            <p>Subtotal:</p>
                            <span>₹{subtotal}</span>
                        </div>
                        <div>
                            <p>Shipping Charges:</p>
                            <span>₹{shippingCharges}</span>
                        </div>
                        <div>
                            <p>Taxes:</p>
                            <span>₹{tax}</span>
                        </div>
                    </div>
                    <div className="orderSummaryTotal">
                        <p><b>Total:</b></p>
                        <span>₹{totalPrice}</span>
                    </div>
                    <button onClick={confirmOrderSubmit}>Proceed To Payment</button>
                </div>
            </div>
        </div>
        </>
    )
    
    
}


export default ConfirmOrder