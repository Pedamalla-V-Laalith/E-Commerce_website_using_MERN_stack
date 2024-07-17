import "./home.css"
import {CgMouse} from "react-icons/cg"
import ProductCard from "./ProductCard.jsx"
import MetaData from "../MetaData.jsx"
import {getProduct,clearErrors} from "../../src/redux-store/actions/productAction.js"
import {useSelector, useDispatch} from "react-redux"
import { useEffect,useState } from "react"
import Loader from "../Loader/Loader.jsx"
import { useAlert } from "react-alert"

function Home()
{
    let [displayError,setDisplayError] = useState("")
    const alert = useAlert()
    const dispatch = useDispatch()
    const {loading,products,error} = useSelector((state)=>{
        return state.product
    })
    useEffect(()=>{
        dispatch(getProduct())
    },[])
    useEffect(()=>{
        if(error)
        {
            setDisplayError(error)
            alert.error(error)
            dispatch(clearErrors())
        }
    },[error])
    if(loading)
    {
        return (
            <>
            <MetaData title="E-COMMERCE" />
            <div className="banner">
                <p>Welcome to E-COMMERCE</p>
                <h1>FIND AMAZING PRODUCTS BELOW</h1>
                <a href="#homeHeading">
                    <button>
                        Scroll <CgMouse/>
                    </button>
                </a>
            </div>
            <h2 className="homeHeading" id="homeHeading">Featured Products</h2>
            <div className="container" id="container">
                <Loader></Loader>
            </div>
            </>
        )
    }
    
    if(products) {return (
        <>
        <MetaData title="E-COMMERCE" />
        <div className="banner">
            <p>Welcome to E-COMMERCE</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            <a href="#homeHeading">
                <button>
                    Scroll <CgMouse/>
                </button>
            </a>
        </div>
        <h2 className="homeHeading" id="homeHeading">Featured Products</h2>
        <div className="container" id="container">
            {/* in the below line we writing products && produ...... 
            because we only want to display products if the products array
            exists. if you understood how our app's state works, then you would
            know that we didn't have products in our state from the beginning */}
            {products && products.map((product,i)=>{return <ProductCard key={i} product={product}/>})}
        </div>
        </>
    )}

    if(displayError != "")
    {
        return (
            <>
            <MetaData title="E-COMMERCE" />
            <div className="banner">
                <p>Welcome to E-COMMERCE</p>
                <h1>FIND AMAZING PRODUCTS BELOW</h1>
                <a href="#homeHeading">
                    <button>
                        Scroll <CgMouse/>
                    </button>
                </a>
            </div>
            <h2 className="homeHeading" id="homeHeading">Featured Products</h2>
            <div className="container" id="container">
                <p style={{color : "rgb(255,0,0)"}}>{displayError}</p>
            </div>
            </>
        )
    }
}

export default Home