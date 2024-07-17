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

export const productReducer = (state = {products : []},action) => {
    switch(action.type)
    {
        case ALL_PRODUCT_REQUEST: return {
            loading : true,
            products : []
        }
        case ALL_PRODUCT_SUCCESS: return {
            loading : false,
            products : action.payload.products,
            productsCount : action.payload.productsCount,
            resultPerPage : action.payload.resultPerPage
        }
        case ALL_PRODUCT_FAILURE: return {
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

export const productDetailsReducer = (state = {product : {}},action) => {
    switch(action.type)
    {
        case PRODUCT_DETAILS_REQUEST: return {
            loading : true,
            ...state
        }
        case PRODUCT_DETAILS_SUCCESS: return {
            loading : false,
            product : action.payload
        }
        case PRODUCT_DETAILS_FAILURE: return {
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

export const newProductReducer = (state = {product : {}},action) => {
    switch(action.type)
    {
        case NEW_PRODUCT_REQUEST: return {
            loading : true,
            ...state
        }
        case NEW_PRODUCT_SUCCESS: return {
            loading : false,
            success : action.payload.success,
            product : action.payload.product
        }
        case NEW_PRODUCT_FAILURE: return {
            ...state,
            loading : false,
            error : action.payload
        }
        case NEW_PRODUCT_RESET: return {
            ...state,
            success : false
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

export const deleteProductReducer = (state = {}, action) => {
    switch(action.type)
    {
        case DELETE_PRODUCT_REQUEST : return {
            loading : true,
            ...state
        }
        case DELETE_PRODUCT_SUCCESS : return {
            loading : false,
            isDeleted : action.payload
        }
        case DELETE_PRODUCT_FAILURE : return {
            loading : false,
            error : action.payload,
            ...state
        }
        case DELETE_PRODUCT_RESET : return {
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

export const updateProductReducer = (state = {}, action) => {
    switch(action.type)
    {
        case UPDATE_PRODUCT_REQUEST : return {
            loading : true,
            ...state
        }
        case UPDATE_PRODUCT_SUCCESS : return {
            loading : false,
            isUpdated : action.payload
        }
        case UPDATE_PRODUCT_FAILURE : return {
            loading : false,
            error : action.payload,
            ...state
        }
        case UPDATE_PRODUCT_RESET : return {
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

export const newReviewReducer = (state = {},action) => {
    switch(action.type)
    {
        case NEW_REVIEW_REQUEST: return {
            loading : true,
            ...state
        }
        case NEW_REVIEW_SUCCESS: return {
            loading : false,
            success : action.payload
        }
        case NEW_REVIEW_FAILURE: return {
            ...state,
            loading : false,
            error : action.payload
        }
        case NEW_REVIEW_RESET: return {
            ...state,
            success : false
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

export const adminProductReducer = (state = {products : []},action) => {
    switch(action.type)
    {
        case ADMIN_PRODUCT_REQUEST: return {
            ...state,
            loading : true
        }
        case ADMIN_PRODUCT_SUCCESS: return {
            ...state,
            loading : false,
            products : action.payload
        }
        case ADMIN_PRODUCT_FAILURE: return {
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