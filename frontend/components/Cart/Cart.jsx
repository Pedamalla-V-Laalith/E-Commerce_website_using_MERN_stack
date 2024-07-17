import "./Cart.css"
import CartItemCard from "./CartItemCard"
import { useSelector, useDispatch } from "react-redux"
import { Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { addItemsToCart } from "../../src/redux-store/actions/cartAction"


function Cart()
{
    const navigate = useNavigate()
    const {cartItems} = useSelector((state)=>{
        return state.cart
    })
    var total = 0
    const checkoutHandler = () => {
        navigate("/shipping")
    }

    return (
        <>
        <div key={"cartPage"} className="cartPage">
            <div className="cartHeader">
                <p>Product</p>
                <p>Quantity</p>
                <p>Sub Total</p>
            </div>
            
            
            {(cartItems.length != 0) && cartItems.map((item)=>{
                total = total + (item.price * item.quantity)
                return (
                    <CartContainerCard key={item.product} item={item} />
                )
            })}

            {(cartItems.length == 0) && <Typography variant="h3" 
            style={{
                color : "rgba(0,0,0,0.7)",
                margin : "auto",
                width : "90%",
                justifyContent : "center",
                display : "flex",
                alignItems : "center",
                height : "15vmax"
                }}>Cart is Empty</Typography>}


            <div className="cartGrossTotal">
                <div></div>
                <div className="cartGrossTotalBox">
                    <p>Gross Total</p>
                    <p>₹{total}</p>
                </div>
                <div></div>
                <div className="checkoutBtn">
                    <button onClick={checkoutHandler}>Check Out</button>
                </div>
            </div>
        </div>
        </>
    )
}


function CartContainerCard({item})
{
    const dispatch = useDispatch()
    const increaseQuantity = (id,quantity,stock) => {
        if(quantity+1 <= stock)
        {
            dispatch(addItemsToCart(id,quantity+1))
        }
    }
    const decreaseQuantity = (id,quantity,stock) => {
        if(quantity-1 >= 1)
        {
            dispatch(addItemsToCart(id,quantity-1))
        }
    }

    return (
        <div key={item.product+"cartContainer"} className="cartContainer">
            <CartItemCard key={item.product+"cartItem"} item = {item}/>
            <div className="cartInput">
                <button onClick={()=>{
                    decreaseQuantity(item.product,item.quantity,item.stock)
                }}>-</button>
                <input type="number" value={item.quantity} readOnly />
                <button onClick={()=>{
                    increaseQuantity(item.product,item.quantity,item.stock)
                }}>+</button>
            </div>
            <p className="cartSubTotal">{`₹${item.price * item.quantity}`}</p>
        </div>
    )
}


export default Cart