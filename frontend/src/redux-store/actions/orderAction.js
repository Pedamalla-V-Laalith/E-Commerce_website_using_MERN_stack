import { 
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAILURE,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAILURE,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAILURE,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_RESET,
    UPDATE_ORDER_FAILURE,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_RESET,
    DELETE_ORDER_FAILURE,
    CLEAR_ERRORS } from "../constants/orderConstants";

import axios from "axios";




export const createOrder = (order) => {
    return async (dispatch) => {
        try {
            dispatch({type : CREATE_ORDER_REQUEST})
            const config = {
                headers: {
                    "Content-Type" : "application/json"
                },
                withCredentials : true
            }
            const {data} = await axios.post("http://localhost:3000/api/v1/order/new",order,config)
            dispatch({
                type : CREATE_ORDER_SUCCESS,
                payload : data.order
            })
        } catch (error) {
            dispatch({
                type : CREATE_ORDER_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const getMyOrders = () => {
    return async (dispatch) => {
        try {
            dispatch({type : MY_ORDERS_REQUEST})
            const config = {
                withCredentials : true
            }
            const {data} = await axios.get("http://localhost:3000/api/v1/orders/me",config)
            dispatch({
                type : MY_ORDERS_SUCCESS,
                payload : data.orders
            })
        } catch (error) {
            dispatch({
                type : MY_ORDERS_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const getOrderDetails = (id) => {
    return async (dispatch) => {
        try {
            dispatch({type : ORDER_DETAILS_REQUEST})
            const config = {
                withCredentials : true
            }
            const {data} = await axios.get(`http://localhost:3000/api/v1/order/${id}`,config)
            dispatch({
                type : ORDER_DETAILS_SUCCESS,
                payload : data.order
            })
        } catch (error) {
            dispatch({
                type : ORDER_DETAILS_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const getAllOrders = () => {
    return async (dispatch) => {
        try {
            dispatch({type : ALL_ORDERS_REQUEST})
            const config = {
                withCredentials : true
            }
            const {data} = await axios.get("http://localhost:3000/api/v1/admin/orders",config)
            dispatch({
                type : ALL_ORDERS_SUCCESS,
                payload : data.orders
            })
        } catch (error) {
            dispatch({
                type : ALL_ORDERS_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const updateOrderStatus = (id,status) =>{
    return async (dispatch) => {
        try {
            dispatch({type : UPDATE_ORDER_REQUEST})
            const config = {
                withCredentials : true,
                headers : {
                    "Content-Type" : "application/json"
                }
            }
            const {data} = await axios.put(`http://localhost:3000/api/v1/admin/order/${id}`,{status},config)
            dispatch({
                type : UPDATE_ORDER_SUCCESS,
                payload : data.success
            })
        } catch (error) {
            dispatch({
                type : UPDATE_ORDER_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const updateOrderReset = () => {
    return async (dispatch)=>{
        dispatch({type : UPDATE_ORDER_RESET})
    }
}

export const deleteOrder = (id) =>{
    return async (dispatch) => {
        try {
            dispatch({type : DELETE_ORDER_REQUEST})
            const config = {
                withCredentials : true
            }
            const {data} = await axios.delete(`http://localhost:3000/api/v1/admin/order/${id}`,config)
            dispatch({
                type : DELETE_ORDER_SUCCESS,
                payload : data.success
            })
        } catch (error) {
            dispatch({
                type : DELETE_ORDER_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const deleteOrderReset = () => {
    return async (dispatch)=>{
        dispatch({type : DELETE_ORDER_RESET})
    }
}

export const clearErrors = () => {
    return async (dispatch)=>{
        dispatch({type : CLEAR_ERRORS})
    }
}