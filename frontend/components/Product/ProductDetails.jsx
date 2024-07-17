import "./ProductDetails.css"
import Carousel from "react-material-ui-carousel"
// import ReactStars from "react-rating-stars-component"
import Loader from "../Loader/Loader"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getProductDetails, newReview, reviewReset } from "../../src/redux-store/actions/productAction"
import {addItemsToCart} from "../../src/redux-store/actions/cartAction"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ReviewCard from "./ReviewCard"
import {useAlert} from "react-alert"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Rating } from "@mui/material"

function ProductDetails()
{
    const alert = useAlert()
    const {id} = useParams()
    const dispatch = useDispatch()
    let [displayError,setDisplayError] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(1)
    const [comment, setComment] = useState("")
    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true)
    }
    const submitReview = () => {
        const data = {
            rating,
            comment,
            productId : id
        }
        dispatch(newReview(data))
    }
    const {loading : reviewLoading, success : reviewSuccess, error : reviewError} = useSelector((state)=>{
        return state.newReview
    })
    useEffect(()=>{
        if(!reviewLoading){
            if(reviewSuccess){
                alert.success("Review submitted successfully")
                setOpen(false)///this is to close the dialog section after submission automatically
                dispatch(reviewReset())
            }
            if(reviewError){
                alert.error(reviewError)
                dispatch(clearErrors())
            }
        }
    },[reviewLoading,reviewSuccess,reviewError])
    const {loading,product,error} = useSelector((state)=>{
        return state.productDetails
    })
    useEffect(()=>{
        dispatch(getProductDetails(id))
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
            <div className="loadingScreen">
                <Loader/>
            </div>
            </>
        )
    }
        
    if(product){const optionsForStars = {
        value : product.ratings, //value for how many stars
        size : "large",
        readOnly : true,
        precision : 0.25
    }
    const increaseQuantity = () => {
        if((quantity + 1) <= product.stock)
        {
            setQuantity(quantity + 1)
        }
    }
    const decreaseQuantity = () => {
        if((quantity - 1) >= 1)
        {
            setQuantity(quantity - 1)
        }
    }
    const customQuantity = (value) => {
        if(value > product.stock)
        {
            setQuantity(product.stock)
        }
        else if(value < 1)
        {
            setQuantity(1)
        }
        else
        {
            setQuantity(value)
        }
    }
    const addToCartHandler = () => {
        dispatch(addItemsToCart(id,quantity))
        alert.success("Items added to cart")
    }

    return (
        <>
        <div className="ProductDetails">
            <div>
            <Carousel>
                {product.images && product.images.map((item,i)=>{
                    return <img className="carouselImage" src= {item.url} key={item.url} alt={`Slide ${i}`}/>
                })}
            </Carousel>
            </div>
            <div className="detailsBlock">
                <div className="detailsBlock-1">
                    <h2>{product.name}</h2>
                    <p>Product #{product._id}</p>
                </div>
                <div className="detailsBlock-2">
                    <Rating key={`ratingStars${product.ratings}`} {...optionsForStars} />
                    <span className="detailsBlock-2-span">{product.numOfReviews} Reviews</span>
                </div>
                <div className="detailsBlock-3">
                    <h1>₹ {product.price}</h1>
                    <div className="detailsBlock-3-1">
                        <div className="detailsBlock-3-1-1">
                            <button onClick={decreaseQuantity}>-</button>
                            <input value={quantity} onChange={(e)=>{
                                customQuantity(e.target.value)
                            }} type="number" />
                            <button onClick={increaseQuantity}>+</button>
                        </div>
                        <button disabled = {product.stock <= 0} onClick={addToCartHandler}>Add to Cart</button>
                    </div>
                    <p>
                        Status: {" "}
                        <b className={product.stock < 1? "redColor" : "greenColor"}>
                            {product.stock < 1? "Out of stock" : "In stock"}
                        </b>
                    </p>
                </div>
                <div className="detailsBlock-4">
                    Description : <p>{product.description}</p>
                </div>
                <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
                {/* submitReviewToggle function will turn open to true resulting in the 
                review dialog section to open. If the user presses close or clicks anywhere 
                else on the screen the dialog will close resulting in the execution of onClose
                function in the dialog section */}
            </div>
        </div>
        <h3 className="reviewsHeading">REVIEWS</h3>

        <Dialog
        aria-labelledby="simple-dialog-title"
        open = {open} //dialog will open if open is true
        onClose={submitReviewToggle} //this will turn open to false
        >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDailog">
                {reviewLoading &&
                    <>
                        <div className="loadingScreen">
                            <Loader/>
                        </div>
                    </>
                }
                <Rating onChange={(e)=>setRating(e.target.value)}
                  value={rating}
                  size="large"
                />
                <textarea
                  className="submitDailogTextArea"
                  cols="30"
                  rows="5"
                  value={comment}
                  onChange={(e)=>setComment(e.target.value)}
                ></textarea>
            </DialogContent>
            <DialogActions>
                <Button onClick={submitReviewToggle} color="secondary">Cancel</Button>
                <Button onClick={submitReview} color="primary">Submit</Button>
            </DialogActions>
        </Dialog>

        {product.reviews && product.reviews[0] ? (<div className="reviews">
            {product.reviews && product.reviews.map((review)=>{
                return (<ReviewCard key={review._id} review = {review} />)
            })}
        </div>) : (<><p className="noReviews">No Reviews Yet</p></>)}
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

export default ProductDetails