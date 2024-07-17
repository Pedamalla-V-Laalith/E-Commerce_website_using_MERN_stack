import axios from "axios";
import  {
    ALL_PRODUCT_REQUEST, 
    ALL_PRODUCT_SUCCESS, 
    ALL_PRODUCT_FAILURE,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAILURE,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_RESET,
    NEW_REVIEW_FAILURE,
    ADMIN_PRODUCT_REQUEST,
    ADMIN_PRODUCT_SUCCESS,
    ADMIN_PRODUCT_FAILURE,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_RESET,
    NEW_PRODUCT_FAILURE,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_RESET,
    DELETE_PRODUCT_FAILURE,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_RESET,
    UPDATE_PRODUCT_FAILURE, 
    CLEAR_ERRORS
} from "../constants/productConstants"

export const getProduct = (keyword = "",currentPage = 1,price = [0,10000000],category = "All",rating = 0) => {
    return async (dispatch) => {
        // try {
        //     dispatch({type : ALL_PRODUCT_REQUEST})
        //     const {data} = await axios.get("http://localhost:3000/api/v1/products")
        //     dispatch({
        //     type : ALL_PRODUCT_SUCCESS,
        //     payload : data
        //     })
        // } catch (error) {
        //     dispatch({
        //         type : ALL_PRODUCT_FAILURE,
        //         payload : error.response.data.message
        //     })
        // }
        dispatch({type : ALL_PRODUCT_REQUEST})
        let link = `http://localhost:3000/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${rating}`
        if(category != "All")
        {
            link = `http://localhost:3000/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${rating}`
        }
        await axios.get(link).then((resp)=>{
            dispatch({
                type : ALL_PRODUCT_SUCCESS,
                payload : resp.data
            })
        }).catch((error)=>{
            dispatch({
                type : ALL_PRODUCT_FAILURE,
                payload : error.response.data.message
            })
        })
    }
}

export const createProduct = (data) => {
    return async (dispatch) => {
        dispatch({type : NEW_PRODUCT_REQUEST})
        const config = {
            headers: {
                "Content-Type" : "application/json"
            },
            withCredentials : true
        }
        await axios.post("http://localhost:3000/api/v1/admin/product/new",data,config).then((resp)=>{
            dispatch({
                type : NEW_PRODUCT_SUCCESS,
                payload : {
                    success : resp.data.success,
                    product : resp.data.product
                }
            })
        }).catch((error)=>{
            dispatch({
                type : NEW_PRODUCT_FAILURE,
                payload : error.response.data.message
            })
        })
    }
}

export const resetCreateProduct = () => {
    return async (dispatch) => {
        dispatch({type : NEW_PRODUCT_RESET})
    }
}

export const deleteProduct = (id) => {
    return async (dispatch) => {
        dispatch({type : DELETE_PRODUCT_REQUEST})
        const config = {withCredentials : true}
        await axios.delete(`http://localhost:3000/api/v1/admin/product/${id}`,config).then((resp)=>{
            dispatch({
                type : DELETE_PRODUCT_SUCCESS,
                payload : resp.data.success
            })
        }).catch((error)=>{
            dispatch({
                type : DELETE_PRODUCT_FAILURE,
                payload : error.response.data.message
            })
        })
    }
}

export const resetDeleteProduct = () => {
    return async (dispatch) => {
        dispatch({type : DELETE_PRODUCT_RESET})
    }
}

export const updateProduct = (id,productData) => {
    return async (dispatch) => {
        dispatch({type : UPDATE_PRODUCT_REQUEST})
        const config = {
            withCredentials : true,
            headers : {"Content-Type" : "application/json"}
        }
        await axios.put(`http://localhost:3000/api/v1/admin/product/${id}`,productData,config).then((resp)=>{
            dispatch({
                type : UPDATE_PRODUCT_SUCCESS,
                payload : resp.data.success
            })
        }).catch((error)=>{
            dispatch({
                type : UPDATE_PRODUCT_FAILURE,
                payload : error.response.data.message
            })
        })
    }
}

export const resetUpdateProduct = () => {
    return async (dispatch) => {
        dispatch({type : UPDATE_PRODUCT_RESET})
    }
}

export const getProductDetails = (id) => {
    return async (dispatch) => {
        dispatch({type : PRODUCT_DETAILS_REQUEST})
        await axios.get("http://localhost:3000/api/v1/product/"+id).then((resp)=>{
            dispatch({
                type : PRODUCT_DETAILS_SUCCESS,
                payload : resp.data.product
            })
        }).catch((error)=>{
            dispatch({
                type : PRODUCT_DETAILS_FAILURE,
                payload : error.response.data.message
            })
        })
    }
}

export const newReview = (data) => {
    return async (dispatch) => {
        dispatch({type : NEW_REVIEW_REQUEST})
        const config = {
            headers: {
                "Content-Type" : "application/json"
            },
            withCredentials : true
        }
        await axios.put("http://localhost:3000/api/v1/review",data,config).then((resp)=>{
            dispatch({
                type : NEW_REVIEW_SUCCESS,
                payload : resp.data.success
            })
        }).catch((error)=>{
            dispatch({
                type : NEW_REVIEW_FAILURE,
                payload : error.response.data.message
            })
        })
    }
}

export const reviewReset = () => {
    return async (dispatch) => {
        dispatch({type : NEW_REVIEW_RESET})
    }
}

export const getAdminProducts = () => {
    return async (dispatch) => {
        dispatch({type : ADMIN_PRODUCT_REQUEST})
        const config = {withCredentials : true}
        await axios.get("http://localhost:3000/api/v1/admin/products",config).then((resp)=>{
            dispatch({
                type : ADMIN_PRODUCT_SUCCESS,
                payload : resp.data.products
            })
        }).catch((error)=>{
            dispatch({
                type : ADMIN_PRODUCT_FAILURE,
                payload : error.response.data.message
            })
        })
    }
}

export const clearErrors = () => {
    return async (dispatch) => {
        dispatch({type : CLEAR_ERRORS})
    }
}