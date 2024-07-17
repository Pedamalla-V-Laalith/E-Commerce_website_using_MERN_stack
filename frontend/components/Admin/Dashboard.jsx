import "./Dashboard.css"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAlert } from "react-alert"
import Loader from "../Loader/Loader"
import SideBar from "./SideBar"
import { getAdminProducts, clearErrors } from "../../src/redux-store/actions/productAction"
import { getAllOrders } from "../../src/redux-store/actions/orderAction"
import { getAllUsers } from "../../src/redux-store/actions/userAction"
import { Typography } from "@material-ui/core"
import { Doughnut, Line } from "react-chartjs-2"
import { 
    Chart,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
    Tooltip,
    ArcElement
 } from "chart.js"

function DashBoard()
{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const alert = useAlert()
    const {loading : userLoading, isAuthenticated, user} = useSelector((state)=>{
        return state.user
    })
    useEffect(()=>{
        if((userLoading == false)&&(isAuthenticated == false))
        {
            // navigate("/login")
            navigate("/login?redirect=admin/dashboard")
        }
    },[isAuthenticated,userLoading])
    useEffect(()=>{
        if((!userLoading) && isAuthenticated){
            if(user.role != "admin"){
                navigate("/")
                alert.error("Access denied")
            }
        }
    },[userLoading,isAuthenticated,user])

    const {loading, products, error} = useSelector((state)=>{
        return state.adminProducts
    })
    const {loading : ordersLoading, orders, error : ordersError} = useSelector((state)=>{
        return state.allOrders
    })
    const {loading : usersLoading, users, error : usersError} = useSelector((state) => {
        return state.allUsers
    })
    useEffect(()=>{
        dispatch(getAdminProducts())
        dispatch(getAllOrders())
        dispatch(getAllUsers())
    },[])
    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(ordersError){
            alert.error(ordersError)
            dispatch(clearErrors())
        }
        if(usersError){
            alert.error(usersError)
            dispatch(clearErrors())
        }
    },[error,ordersError,usersError])
    let outOfStock = 0
    products.forEach((element) => {
        if(element.stock == 0){
            outOfStock++
        }
    });
    let totalPrice = 0
    orders.forEach((element)=>{
        totalPrice += element.totalPrice
    })

    Chart.register(
        LineElement,
        CategoryScale,
        LinearScale,
        PointElement,
        Legend,
        Tooltip,
        ArcElement
    )
    const lineState = {
        labels : ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label : "TOTAL AMOUNT",
                backgroundColor : ["tomato"],
                hoverBackgroundColor : ["rgb(197,72,49)"],
                data : [0,totalPrice],
            },
        ],
    };
    const doughnutState = {
        labels : ["Out of Stock", "InStock"],
        datasets: [
            {
                backgroundColor : ["#00A6B4","#6800B4"],
                hoverBackgroundColor : ["#4B5000","#35014F"],
                data:[outOfStock,(products.length - outOfStock)]
            }
        ]
    }

    if(userLoading){
        return (
            <>
            <div className="loadingScreen">
               <Loader/>
            </div>
            </>
        )
    }
    if(loading){
        return (
            <>
            <div className="loadingScreen">
               <Loader/>
            </div>
            </>
        )
    }
    return (
        <>
        {user &&
            <>
            <div className="dashboard">
                <SideBar/>
                <div className="dashboardContainer">
                    <Typography component="h1">Dashboard</Typography>
                    <div className="dashboardSummary">
                        <div>
                            <p>
                                Total Amount <br/> ₹{totalPrice}
                            </p>
                        </div>
                        <div className="dashboardSummaryBox2">
                            <Link to="/admin/products">
                                <p>Products</p>
                                <p>{products && products.length}</p>
                            </Link>
                            <Link to="/admin/orders">
                                <p>Orders</p>
                                <p>{orders && orders.length}</p>
                            </Link>
                            <Link to="/admin/users">
                                <p>Users</p>
                                <p>{users && users.length}</p>
                            </Link>
                        </div>
                    </div>
                    <div className="lineChart">
                        <Line data={lineState}/>
                    </div>
                    <div className="doughnutChart">
                        <Doughnut data={doughnutState}/>
                    </div>
                </div>
            </div>
            </>
        }
        </>
    )
}


export default DashBoard