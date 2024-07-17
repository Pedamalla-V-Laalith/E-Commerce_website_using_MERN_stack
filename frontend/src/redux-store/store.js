import {createStore, applyMiddleware, combineReducers} from "redux"
import {thunk} from "redux-thunk"
import {composeWithDevTools} from "redux-devtools-extension"
import {productReducer, productDetailsReducer,newProductReducer, deleteProductReducer, newReviewReducer, adminProductReducer, updateProductReducer} from "./reducers/productReducer"
import { allUsersReducer, userDetailsReducer, userUpdateAndDeleteReducer, userReducer, accountReducer, forgotPasswordReducer } from "./reducers/userReducer"
import { cartReducer } from "./reducers/cartReducer"
import { orderReducer, allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer } from "./reducers/orderReducer"

const reducer = combineReducers({
    product : productReducer,
    productDetails : productDetailsReducer,
    user : userReducer,
    profile : accountReducer,
    forgotPassword : forgotPasswordReducer,
    cart : cartReducer,
    newOrder : newOrderReducer,
    myOrders : myOrdersReducer,
    orderDetails : orderDetailsReducer,
    newReview : newReviewReducer,
    adminProducts : adminProductReducer,
    newProduct : newProductReducer,
    deleteProduct : deleteProductReducer,
    updateProduct : updateProductReducer,
    allOrders : allOrdersReducer,
    order : orderReducer,
    allUsers : allUsersReducer,
    userDetails : userDetailsReducer,
    userUpdateAndDelete : userUpdateAndDeleteReducer
})

let initialState = {
    cart : {
        cartItems : localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
        shippingInfo : localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {}
    }
}

const middleware = [thunk]

// const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))
const store = createStore(reducer,initialState,applyMiddleware(...middleware))
 export default store