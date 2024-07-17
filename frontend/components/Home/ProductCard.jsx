import { Link } from "react-router-dom"
// import ReactStars from "react-rating-stars-component"
import { Rating } from "@material-ui/lab"

function ProductCard({product})
{
    //options for ReactStars component
    const options = {
        // edit : false, //now we cannot edit
        // color : "rgba(20,20,20,0.3)", //color for stars which are not selected
        // activeColor : "tomato", //color for stars which are selected
        value : product.ratings, //value for how many stars
        // isHalf : true, //for any fraction stars
        // size : window.innerWidth < 600 ? 20 : 25 //size for the stars
        size : "medium",
        readOnly : true,
        precision : 0.25
    }

    return (
        <>
        <Link className="productCard" to={"/product/"+product._id}>
            <img src={product.images[0].url} alt={product.name} />
            <p>{product.name}</p>
            <div>
                <Rating {...options} /> <span className="productCard-div-span">({product.numOfReviews} Reviews)</span>
            </div>
            <span>₹ {product.price}</span>
        </Link>
        </>
    )
}

export default ProductCard