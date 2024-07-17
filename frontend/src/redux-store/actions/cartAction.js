import {
    ADD_TO_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO} from "../constants/cartConstants"
import axios from "axios"


export const addItemsToCart = (id,quantity) => {
    return async (dispatch, getState)=>{
        //getState is a function which returns the present state of the application.
        const {data} = await axios.get("http://localhost:3000/api/v1/product/"+id)


        dispatch({
            type :ADD_TO_CART,
            payload : {
                product : data.product._id,
                name : data.product.name,
                price : data.product.price,
                image : data.product.images[0].url,
                stock : data.product.stock,
                quantity
            }
        })
        
        localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems))
    }
}

export const removeItemsFromCart = (id) => {
    return (dispatch,getState) => {
        dispatch({
            type : REMOVE_CART_ITEM,
            payload : id
        })
        localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems))
    }
}

export const saveShippingInfo = (data) => {
    return (dispatch) => {
        dispatch({
            type : SAVE_SHIPPING_INFO,
            payload : data
        })
        localStorage.setItem("shippingInfo", JSON.stringify(data))
    }
}