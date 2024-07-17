import "./MyOrders.css"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useAlert } from "react-alert"
import { Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { Launch } from "@mui/icons-material"
import Loader from "../Loader/Loader"
import { DataGrid } from '@mui/x-data-grid'
import { clearErrors, getMyOrders } from "../../src/redux-store/actions/orderAction"



function MyOrders()
{
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const alert = useAlert()
    const {loading : userLoading, isAuthenticated, user} = useSelector((state)=>{
        return state.user
    })
    const {loading, orders, error} = useSelector((state)=>{
        return state.myOrders
    })
    const rows = []
    const columns = [
        {
            field : "id",
            headerName: "Order Id",
            minWidth : 300,
            flex : 1,
            sortable : false
        },
        {
            field : "status",
            headerName : "Status",
            minWidth : 150,
            flex : 0.5,
            sortable : false,
            cellClassName : (params) => {
                return params.row.status == "Delivered" ? "greenColor" : "redColor"
            }
        },
        {
            field : "itemsQty",
            headerName : "Items Qty",
            type : "number",
            minWidth : 150,
            flex : 0.3
        },
        {
            field : "amount",
            headerName : "Amount",
            type : "number",
            minWidth : 270,
            flex : 0.5
        },
        {
            field : "actions",
            flex : 0.3,
            headerName : "Actions",
            minWidth : 150,
            type : "number",
            sortable : false,
            renderCell : (params) => {
                return (
                    <Link to={`order/${params.row.id}`}>
                        <Launch/>
                    </Link>
                )
            }
        }
    ]
    if(orders && orders.length != 0)
    {
        orders.forEach((item, index) => {
            rows.push({
                itemsQty : item.orderItems.length,
                id : item._id,
                status : item.orderStatus,
                amount : item.totalPrice
            })
        });
    }
    useEffect(()=>{
        if((userLoading == false)&&(isAuthenticated == false))
        {
            // navigate("/login")
            navigate("/login?redirect=orders")
        }
    },[isAuthenticated,userLoading])
    useEffect(()=>{
        if(error)
        {
            alert.error(error)
            dispatch(clearErrors())
        }
    },[error])
    useEffect(()=>{
        dispatch(getMyOrders())
    },[])

    
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
        <div className="myOrdersPage">
            <DataGrid 
                rows={rows}
                columns={columns}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                autoHeight
                className="myOrdersTable"></DataGrid>
            <Typography className = "myOrdersHeading">{user && user.name}'s Orders</Typography>
        </div>
        </>
    )
}


export default MyOrders