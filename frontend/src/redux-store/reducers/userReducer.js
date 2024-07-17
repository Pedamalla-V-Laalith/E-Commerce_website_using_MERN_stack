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


export const userReducer = (state = {user : {}},action) => {
    switch(action.type)
    {
        case LOGIN_REQUEST : return {
            loading : true,
            isAuthenticated : false
        }
        case LOGIN_SUCCESS : return {
            ...state,
            loading : false,
            isAuthenticated : true,
            user : action.payload
        }
        case LOGIN_FAILURE : return {
            ...state,
            loading : false,
            isAuthenticated : false,
            user : null,
            error : action.payload
        }
        case REGISTER_USER_REQUEST : return {
            loading : true,
            isAuthenticated : false
        }
        case REGISTER_USER_SUCCESS : return {
            ...state,
            loading : false,
            isAuthenticated : true,
            user : action.payload
        }
        case REGISTER_USER_FAILURE : return {
            ...state,
            loading : false,
            isAuthenticated : false,
            user : null,
            error : action.payload
        }
        case LOAD_USER_REQUEST : return {
            loading : true,
            isAuthenticated : false
        }
        case LOAD_USER_SUCCESS : return {
            ...state,
            loading : false,
            isAuthenticated : true,
            user : action.payload
        }
        case LOAD_USER_FAILURE : return {
            loading : false,
            isAuthenticated : false,
            user : null,
            error : action.payload
        }
        case LOGOUT_REQUEST : return {
            ...state,
            loading : true
        }
        case LOGOUT_SUCCESS : return {
            loading : false,
            isAuthenticated : false,
            user : null
        }
        case LOGOUT_FAILURE : return {
            ...state,
            loading : false,
            error : action.payload
        }
        case CLEAR_ERRORS : return {
            ...state,
            error : undefined
        }
        default : return {
            ...state
        }
    }
}

export const accountReducer = (state = {}, action) => {
    switch(action.type)
    {
        case UPDATE_PROFILE_REQUEST : 
        case UPDATE_PASSWORD_REQUEST :
        return {
            ...state,
            loading : true
        }
        case UPDATE_PROFILE_SUCCESS : 
        case UPDATE_PASSWORD_SUCCESS :
        return {
            ...state,
            loading : false,
            isUpdated : action.payload
        }
        case UPDATE_PROFILE_FAILURE : 
        case UPDATE_PASSWORD_FAILURE :
        return {
            ...state,
            loading : false,
            error : action.payload
        }
        case UPDATE_PROFILE_RESET : 
        case UPDATE_PASSWORD_RESET:
        return {
            ...state,
            isUpdated : false
        }
        case CLEAR_ERRORS : return {
            ...state,
            error : undefined
        }
        default : return {
            ...state
        }
    }
}

export const forgotPasswordReducer = (state = {}, action) => {
    switch(action.type)
    {
        case FORGOT_PASSWORD_REQUEST :
        case RESET_PASSWORD_REQUEST:
        return {
            ...state,
            loading : true
        }
        case FORGOT_PASSWORD_SUCCESS :
        return {
            ...state,
            loading : false,
            message : action.payload
        }
        case RESET_PASSWORD_SUCCESS :
        return {
            ...state,
            loading : false,
            success : action.payload
        }
        case FORGOT_PASSWORD_FAILURE :
        case RESET_PASSWORD_FAILURE:
        return {
            ...state,
            loading : false,
            error : action.payload
        }
        case CLEAR_ERRORS : return {
            ...state,
            error : undefined
        }
        default : return {
            ...state
        }
    }
}

//for admins
export const allUsersReducer = (state = {users : []}, action) => {
    switch(action.type)
    {
        case GET_USERS_REQUEST:
        return {
            ...state,
            loading : true
        }
        case GET_USERS_SUCCESS :
        return {
            ...state,
            loading : false,
            users : action.payload
        }
        case GET_USERS_FAILURE:
        return {
            ...state,
            loading : false,
            error : action.payload
        }
        case CLEAR_ERRORS : return {
            ...state,
            error : undefined
        }
        default : return {
            ...state
        }
    }
}

export const userDetailsReducer = (state = {userDetails : {}}, action) => {
    switch(action.type)
    {
        case GET_USER_REQUEST:
        return {
            ...state,
            loading : true
        }
        case GET_USER_SUCCESS :
        return {
            ...state,
            loading : false,
            userDetails : action.payload
        }
        case GET_USER_FAILURE:
        return {
            ...state,
            loading : false,
            error : action.payload
        }
        case CLEAR_ERRORS : return {
            ...state,
            error : undefined
        }
        default : return {
            ...state
        }
    }
}

export const userUpdateAndDeleteReducer = (state = {}, action) => {
    switch(action.type)
    {
        case UPDATE_USER_REQUEST : 
        case DELETE_USER_REQUEST :
        return {
            ...state,
            loading : true
        }
        case UPDATE_USER_SUCCESS : 
        return {
            ...state,
            loading : false,
            isUpdated : action.payload
        }
        case DELETE_USER_SUCCESS :
        return {
            ...state,
            loading : false,
            isDeleted : action.payload
        }
        case UPDATE_USER_FAILURE : 
        case DELETE_USER_FAILURE :
        return {
            ...state,
            loading : false,
            error : action.payload
        }
        case UPDATE_USER_RESET : 
        return {
            ...state,
            isUpdated : false
        }
        case DELETE_USER_RESET :
        return {
            ...state,
            isDeleted : false
        }
        case CLEAR_ERRORS : return {
            ...state,
            error : undefined
        }
        default : return {
            ...state
        }
    }
}