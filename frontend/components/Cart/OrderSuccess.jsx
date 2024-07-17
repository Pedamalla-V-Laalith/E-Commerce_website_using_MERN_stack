import "./OrderSuccess.css"
import { CheckCircle } from "@mui/icons-material"
import { Typography } from "@material-ui/core"
import { useNavigate } from "react-router-dom"

function OrderSuccess()
{
    const navigate = useNavigate()

    return (
        <>
        <div className="orderSuccess">
            <CheckCircle/>
            <Typography>Payment Successfull!!!</Typography>
            <Typography>Order has been placed</Typography>
            <b className="note">Please check your order history to see whether no error occured during the process</b>
            <b className="note">If order is not placed and the amount is deducted, it will be refunded shortly</b>
            <br></br>
            <button onClick={()=>{
                navigate("/orders")
            }}>View Orders</button>
        </div>
        </>
    )
}


export default OrderSuccess