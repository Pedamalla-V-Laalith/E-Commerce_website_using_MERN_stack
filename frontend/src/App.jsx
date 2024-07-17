import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import WebFont from 'webfontloader'
import { useEffect, useState } from 'react'
import store from "./redux-store/store"
import { useSelector } from 'react-redux'
import axios from 'axios'


import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Home from '../components/Home/Home'
import ProductDetails from "../components/Product/ProductDetails"
import Products from "../components/Product/Products"
import Search from "../components/Product/Search"
import LoginSignup from '../components/User/LoginSignup'
import { loadUser } from './redux-store/actions/userAction'
import UserOptions from '../components/Header/UserOptions'
import Account from "../components/User/Account"
import UpdateProfile from '../components/User/UpdateProfile'
import UpdatePassword from '../components/User/UpdatePassword'
import ForgotPassword from '../components/User/ForgotPassword'
import ResetPassword from '../components/User/ResetPassword'
import Cart from '../components/Cart/Cart'
import Shipping from '../components/Cart/Shipping'
import ConfirmOrder from '../components/Cart/ConfirmOrder'
import Payment from '../components/Cart/Payment'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import OrderSuccess from '../components/Cart/OrderSuccess'
import MyOrders from '../components/Order/MyOrders'
import OrderDetails from '../components/Order/OrderDetails'
import DashBoard from '../components/Admin/Dashboard'
import ProductList from '../components/Admin/ProductList'
import NewProduct from '../components/Admin/NewProduct'
import UpdateProduct from '../components/Admin/UpdateProduct'
import OrderList from '../components/Admin/OrderList'
import UsersList from '../components/Admin/UsersList'
import UpdateUser from '../components/Admin/UpdateUser'
import Contact from '../components/Header/Contact'
import About from '../components/Header/About'

function App() {
  useEffect(()=>{
    WebFont.load({
      google:{
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    })
    store.dispatch(loadUser())
  },[])

  const [stripeApiKey,setStripeApiKey] = useState("")
  const getStripeApiKey = async ()=>{
    const {data} = await axios.get("http://localhost:3000/api/v1/stripeapikey",{withCredentials : true})
    setStripeApiKey(data.stripe_api_key)
  }
  const {user,isAuthenticated} = useSelector((state)=>{
    return state.user
  })
  useEffect(()=>{
    getStripeApiKey()
  },[isAuthenticated])
  //in dependencies we included isAuthenticated because the request that goes
  //out in getStripeApiKey needs authentication so if whenever user logs out
  //or logs in this request will be going out
  window.addEventListener("contextmenu",(e) => e.preventDefault())
  //the above statement prevents right click
  return (
    <>
      <Router>
        <Header></Header>
        {isAuthenticated && <UserOptions user={user}/>}
        <Routes>
          <Route path='/' element = {<Home/>} />
          <Route path='/product/:id' element = {<ProductDetails/>} />
          <Route path='/products' element = {<Products/>}/>
          <Route path='/products/:keyword' element = {<Products/>}/>
          <Route path='/Search' element = {<Search/>}/>
          <Route path='/login' element = {<LoginSignup/>}/>
          <Route path='/account' element = {<Account/>}/>
          <Route path='/me/update' element = {<UpdateProfile/>} />
          <Route path='/password/update' element = {<UpdatePassword/>} />
          <Route path='/password/forgot' element = {<ForgotPassword/>} />
          <Route path='/password/reset/:token' element = {<ResetPassword/>} />
          <Route path='/shoppingCart' element = {<Cart/>} />
          <Route path='/shipping' element = {<Shipping/>} />
          <Route path='/order/confirm' element = {<ConfirmOrder/>} />
          {/* the below route won't be available if the user is not logged in
          or stripeApiKey is not available */}
          {stripeApiKey && (<Route path='/process/payment' element = {
          <Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements>
          } />)}
          <Route path='/success' element = {<OrderSuccess/>} />
          <Route path='/orders' element = {<MyOrders/>} />
          <Route path='/orders/order/:id' element = {<OrderDetails/>} />
          <Route path='/admin/dashboard' element = {<DashBoard/>} />
          <Route path='/admin/products' element = {<ProductList/>} />
          <Route path='/admin/product' element = {<NewProduct/>} />
          <Route path='/admin/product/:id' element = {<UpdateProduct/>} />
          <Route path='/admin/orders' element = {<OrderList/>} />
          <Route path='/admin/orders/order/:id' element = {<OrderDetails/>} />
          <Route path='/admin/users' element = {<UsersList/>} />
          <Route path='/admin/users/user/:id' element = {<UpdateUser/>} />
          <Route path='/contact' element = {<Contact/>} />
          <Route path='/about' element = {<About/>} />
        </Routes>
        <Footer></Footer>
      </Router>
    </>
  )
}

export default App
