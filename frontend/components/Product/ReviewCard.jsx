// import ReactStars from "react-rating-stars-component"
import { Rating } from "@mui/material"
import "./ProductDetails.css"
import profilePng from "../../../images/userprofile.png"
function ReviewCard({review})
{
    const optionsForStars = {
        // edit : false, //now we cannot edit
        // color : "rgba(20,20,20,0.3)", //color for stars which are not selected
        // activeColor : "tomato", //color for stars which are selected
        value : review.rating, //value for how many stars
        // isHalf : true, //for any fraction stars
        // size : window.innerWidth < 600 ? 20 : 25 //size for the stars
        size : "small",
        precision : 0.25,
        readOnly : true
    }
    return (
        <>
        <div className="reviewCard">
            <img src= {profilePng} alt="User" />
            <p>{review.name}</p>
            <Rating {...optionsForStars} />
            <span className="reviewCard-span">{review.comment}</span>
        </div>
        </>
    )
}

export default ReviewCard