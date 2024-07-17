import "./Products.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getProduct } from "../../src/redux-store/actions/productAction"
import Loader from "../Loader/Loader"
import ProductCard from "../Home/ProductCard"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Pagination from "react-js-pagination"
import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"
import { useAlert } from "react-alert"

function Products()
{
    const alert = useAlert()
    let [displayError,setDisplayError] = useState("")
    const {keyword} = useParams()
    const {loading,products,productsCount,resultPerPage,error} = useSelector((state)=>{
        return state.product
    })
    const [currentPage,setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0,10000000])
    const [pricebutton,setPricebutton] = useState(false)
    const [category, setCategory] = useState("All")
    const categories = ["All","Laptop","Footwear","Bottom","Tops","Attire","Camera","Smart Phones"]
    const [rating,setRating] = useState(0)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getProduct(keyword,currentPage,price,category,rating))
    },[keyword,currentPage,pricebutton,category,rating])
    useEffect(()=>{
        if(error)
        {
            setDisplayError(error)
            alert.error(error)
            dispatch(clearErrors())
        }
    },[error])

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }
    const priceHandler = (e,newPrice) => {
        setPrice(newPrice)
    }
    const resetPriceHandler = (e) => {
        setPrice([0,10000000])
        setPricebutton(!pricebutton)
    }

    if(loading)
    {
        return (
            <>
            <div className="loadingScreen">
                <Loader/>
            </div>
            </>
        )
    }
    if(products){return (
        <>
        <h2 className="productsHeading">Products</h2>
        <div className="products">
            {products && (productsCount != 0) && products.map((product)=>{
                return (<ProductCard key={product._id} product={product}/>)
            })}
            {productsCount == 0 && <Typography variant="h3" style={{color : "rgba(0,0,0,0.7)"}}>No Products Found</Typography>}
        </div>
        <div className="filterBox">
            <Typography>Price</Typography>
            <Slider 
                value={price}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={100000}>
            </Slider>
            <button onClick={()=>{setPricebutton(!pricebutton)}}>Set Price Filter</button>
            <br></br>
            <button onClick={()=>{resetPriceHandler()}}>Reset Price Filter</button>           
            
            <ul className="categoryBox">
            <Typography>Categories</Typography>
                {categories.map((category)=>{
                    return <li 
                            className="category-link"
                            key={category}
                            onClick={() => {setCategory(category)}}>
                                {category}
                            </li>
                })}
            </ul>
            <fieldset>
                <Typography component="legend">Ratings Above</Typography>
                <Slider
                    value={rating}
                    onChange={(e,newRating)=>{setRating(newRating)}}
                    aria-labelledby="continuous-slider"
                    min={0}
                    max={5}
                    valueLabelDisplay="auto"
                ></Slider>
            </fieldset>
        </div>
        {resultPerPage < productsCount && (
            <div className="paginationBox">
            <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="first"
                lastPageText="last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"></Pagination>
        </div>
        )}
        </>
    )}
    if(displayError != "")
    {
        return (
            <>
            <div className="errorScreen"><h2>{displayError}</h2></div>
            </>
        )
    }
}

export default Products