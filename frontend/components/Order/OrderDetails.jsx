import "./OrderDetails.css"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useAlert } from "react-alert"
import { Link, useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { clearErrors, getOrderDetails } from "../../src/redux-store/actions/orderAction"
import Loader from "../Loader/Loader"
import { Typography } from "@material-ui/core"


function OrderDetails()
{
    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {id} = useParams()
    const {loading : userLoading, isAuthenticated} = useSelector((state)=>{
        return state.user
    })
    const {loading, order, error} = useSelector((state)=>{
        return state.orderDetails
    })
    useEffect(()=>{
        if((userLoading == false) && (isAuthenticated == false))
        {
            navigate(`/login?redirect=orders/order/${id}`)
        }
    },[isAuthenticated,userLoading])
    useEffect(()=>{
        if(error)
        {
            alert.error(error)
            dispatch(clearErrors())
        }
    },[error])
    useEffect(()=>{
        dispatch(getOrderDetails(id))
    },[])

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
    if(loading)
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
        { order._id &&
        <>
        <div className="orderDetailsPage">
            <div className="orderDetailsContainer">
                <Typography component="h1">
                    Order #{order._id}
                </Typography>
                <Typography>Shipping Info</Typography>
                <div className="orderDetailsContainerBox">
                    <div>
                        <p>Name :</p>
                        <span>{order.user.name}</span>
                    </div>
                    <div>
                        <p>Phone :</p>
                        <span>
                            {order.shippingInfo.phoneNo}
                        </span>
                    </div>
                    <div>
                        <p>Address :</p>
                        <span>
                            {`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pincode}, ${order.shippingInfo.country}`}
                        </span>
                    </div>
                </div>
                <Typography>Payment</Typography>
                <div className="orderDetailsContainerBox">
                    <div>
                        <p className={order.paymentInfo.status == "succeeded" ? "greenColor" : "redColor"}>
                            {order.paymentInfo.status == "succeeded" ?
                                "PAID" : "NOT PAID"}
                        </p>
                    </div>
                    <div>
                        <p>Amount :</p>
                        <span>{order.totalPrice}</span>
                    </div>
                </div>
                <Typography>Order Status</Typography>
                <div className="orderDetailsContainerBox">
                    <div>
                        <p className={order.orderStatus == "Delivered" ? "greenColor" : "redColor"}>
                            {order.orderStatus}
                        </p>
                    </div>
                </div>
            </div>
            <div className="orderDetailsCartItems">
                <Typography>Order Items :</Typography>
                <div className="orderDetailsCartItemsContainer">
                    {order.orderItems.map((item)=>{
                        return (
                            <div key={item.product}>
                                <img src={item.image} alt="Product"/>
                                <Link to={"/product/"+item.product}>
                                    {item.name}
                                </Link>
                                <span>
                                    {item.quantity} X ₹{item.price} = {" "}
                                    <b>₹{item.price * item.quantity}</b>
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
        </>
        }
        </>
    )
}


export default OrderDetails