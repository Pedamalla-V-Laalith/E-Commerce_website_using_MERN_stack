import { LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILURE,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    CLEAR_ERRORS,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS, 
    UPDATE_PROFILE_RESET, 
    UPDATE_PROFILE_FAILURE,
    UPDATE_PASSWORD_REQUEST, 
    UPDATE_PASSWORD_SUCCESS, 
    UPDATE_PASSWORD_RESET, 
    UPDATE_PASSWORD_FAILURE, 
    FORGOT_PASSWORD_REQUEST, 
    FORGOT_PASSWORD_SUCCESS, 
    FORGOT_PASSWORD_FAILURE, 
    RESET_PASSWORD_REQUEST, 
    RESET_PASSWORD_SUCCESS, 
    RESET_PASSWORD_FAILURE,
    GET_USERS_REQUEST,
    GET_USERS_SUCCESS,
    GET_USERS_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_RESET,
    UPDATE_USER_FAILURE,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_RESET,
    DELETE_USER_FAILURE
    } from "../constants/userConstants"
import axios from "axios"


export const login = (email,password) => {
    return async (dispatch)=>{
        try {
            dispatch({type : LOGIN_REQUEST})
            const {data} = await axios.post(
                "http://localhost:3000/api/v1/login",
                {email, password},
                {headers : {"Content-Type" : "application/json"},withCredentials : true}
                )
            dispatch({type : LOGIN_SUCCESS, payload : data.user})
            
        } catch (error) {
            dispatch({
                type : LOGIN_FAILURE, 
                payload : error.response.data.message
            })
        }
    }
}

export const signup = (userData) => {
    return async (dispatch) => {
        try {
            dispatch({type : REGISTER_USER_REQUEST})
            const {data} = await axios.post(
                "http://localhost:3000/api/v1/register",
                userData,
                {headers : {"Content-Type" : "multipart/form-data"},withCredentials : true}
            )
            dispatch({type : REGISTER_USER_SUCCESS, payload : data.user})
        } catch (error) {
            dispatch({
                type : REGISTER_USER_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const loadUser = () => {
    return async (dispatch) => {
        try {
            dispatch({type : LOAD_USER_REQUEST})
            const {data} = await axios.get("http://localhost:3000/api/v1/me",{withCredentials : true})
            dispatch({type : LOAD_USER_SUCCESS, payload : data.user})
        } catch (error) {
            dispatch({
                type : LOAD_USER_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const logout = () => {
    return async (dispatch)=>{
        try {
            dispatch({type : LOGOUT_REQUEST})
            await axios.get("http://localhost:3000/api/v1/logout",{withCredentials : true})
            dispatch({type : LOGOUT_SUCCESS})
        } catch (error) {
            dispatch({
                type : LOGOUT_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

//updating profile
export const updateProfile = (userData) => {
    return async (dispatch) => {
        try {
            dispatch({type : UPDATE_PROFILE_REQUEST})
            const {data} = await axios.put(
                "http://localhost:3000/api/v1/me/update",
                userData,
                {headers : {"Content-Type" : "multipart/form-data"},withCredentials : true}
            )
            dispatch({type : UPDATE_PROFILE_SUCCESS, payload : data.success})
        } catch (error) {
            dispatch({
                type : UPDATE_PROFILE_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}
export const resetUpdateProfile = () => {
    return (dispatch) => {
        dispatch({type : UPDATE_PROFILE_RESET})
    }
}
export const updatePassword = (passwords) => {
    return async (dispatch) => {
        try {
            dispatch({type : UPDATE_PASSWORD_REQUEST})
            const {data} = await axios.put(
                "http://localhost:3000/api/v1/password/update",
                passwords,
                {headers : {"Content-Type" : "application/json"},withCredentials : true}
            )
            dispatch({type : UPDATE_PASSWORD_SUCCESS, payload : data.success})
        } catch (error) {
            dispatch({
                type : UPDATE_PASSWORD_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}
export const resetUpdatePassword = () => {
    return (dispatch) => {
        dispatch({type : UPDATE_PASSWORD_RESET})
    }
}
export const forgotPassword = (email) => {
    return async (dispatch) => {
        try {
            dispatch({type : FORGOT_PASSWORD_REQUEST})
            const {data} = await axios.post(
                "http://localhost:3000/api/v1/password/forgot",
                email,
                {headers : {"Content-Type" : "application/json"},withCredentials : true}
            )
            dispatch({type : FORGOT_PASSWORD_SUCCESS, payload : data.message})
        } catch (error) {
            dispatch({
                type : FORGOT_PASSWORD_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}
export const resetPassword = (token,passwords) => {
    return async (dispatch) => {
        try {
            dispatch({type : RESET_PASSWORD_REQUEST})
            const {data} = await axios.put(
                "http://localhost:3000/api/v1/password/reset/"+token,
                passwords,
                {headers : {"Content-Type" : "application/json"},withCredentials : true}
            )
            dispatch({type : RESET_PASSWORD_SUCCESS, payload : data.success})
        } catch (error) {
            dispatch({
                type : RESET_PASSWORD_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const clearErrors = () => (dispatch) => {dispatch({type : CLEAR_ERRORS})}

//for admins
export const getAllUsers = () => {
    return async (dispatch) => {
        try {
            dispatch({type : GET_USERS_REQUEST})
            const config = {withCredentials : true}
            const {data} = await axios.get("http://localhost:3000/api/v1/admin/users",config)
            dispatch({
                type : GET_USERS_SUCCESS,
                payload : data.users
            })

        } catch (error) {
            dispatch({
                type : GET_USERS_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const getUserDetails = (id) => {
    return async (dispatch) => {
        try {
            dispatch({type : GET_USER_REQUEST})
            const config = {withCredentials : true}
            const {data} = await axios.get(`http://localhost:3000/api/v1/admin/user/${id}`,config)
            dispatch({
                type : GET_USER_SUCCESS,
                payload : data.user
            })

        } catch (error) {
            dispatch({
                type : GET_USER_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const updateUser = (id,userData) => {
    return async (dispatch) => {
        try {
            dispatch({type : UPDATE_USER_REQUEST})
            const config = {
                withCredentials : true,
                headers : {
                    "Content-Type" : "application/json"
                }
            }
            const {data} = await axios.put(`http://localhost:3000/api/v1/admin/user/${id}`,userData,config)
            dispatch({
                type : UPDATE_USER_SUCCESS,
                payload : data.success
            })

        } catch (error) {
            dispatch({
                type : UPDATE_USER_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const resetUpdateUser = () => {
    return async (dispatch) => {
        dispatch({
            type : UPDATE_USER_RESET
        })
    }
}

export const deleteUser = (id) => {
    return async (dispatch) => {
        try {
            dispatch({type : DELETE_USER_REQUEST})
            const config = {withCredentials : true}
            const {data} = await axios.delete(`http://localhost:3000/api/v1/admin/user/${id}`,config)
            dispatch({
                type : DELETE_USER_SUCCESS,
                payload : data.success
            })

        } catch (error) {
            dispatch({
                type : DELETE_USER_FAILURE,
                payload : error.response.data.message
            })
        }
    }
}

export const resetDeleteUser = () => {
    return async (dispatch) => {
        dispatch({
            type : DELETE_USER_RESET
        })
    }
}