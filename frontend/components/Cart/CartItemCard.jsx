import "./CartItemCard.css"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { removeItemsFromCart } from "../../src/redux-store/actions/cartAction"


function CartItemCard({item})
{
    const dispatch = useDispatch()
    const removeItem = (id) => {
        dispatch(removeItemsFromCart(id))
    }

    return (
        <>
        <div className="cartItemCard">
            <img src={item.image} alt={item.name}/>
            <div>
                <Link to={"/product/"+item.product}>{item.name}</Link>
                <span>{`Price: ₹${item.price}`}</span>
                <p onClick={()=>{removeItem(item.product)}}>Remove</p>
            </div>
        </div>
        </>
    )
}


export default CartItemCard