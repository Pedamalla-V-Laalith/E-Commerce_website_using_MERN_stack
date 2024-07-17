import "./OrderList.css"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAlert } from "react-alert"
import { useSelector, useDispatch } from "react-redux"
import Loader from "../Loader/Loader"
import SideBar from "./SideBar"
import { getAllOrders,updateOrderStatus,deleteOrder,updateOrderReset,deleteOrderReset,clearErrors } from "../../src/redux-store/actions/orderAction"
import { DataGrid } from "@mui/x-data-grid"
import { Delete, LocalShipping, Launch } from "@mui/icons-material"
import { Button } from "@material-ui/core"

function OrderList(){
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
            navigate("/login?redirect=admin/orders")
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

    const {loading : allOrdersLoading, orders, error : allOrdersError} = useSelector((state)=>{
        return state.allOrders
    })
    const {loading : orderLoading, isUpdated, isDeleted, error : orderError} = useSelector((state)=>{
        return state.order
    })
    useEffect(()=>{
        dispatch(getAllOrders())
    },[])
    useEffect(()=>{
        if(orderError){
            alert.error(orderError)
            dispatch(clearErrors())
        }
        if(allOrdersError){
            alert.error(allOrdersError)
            dispatch(clearErrors())
        }
    },[orderError,allOrdersError])
    useEffect(()=>{
        if(isUpdated){
            alert.success("Successfully updated order status")
            dispatch(updateOrderReset())
            dispatch(getAllOrders())
        }
        if(isDeleted){
            alert.success("Successfully deleted the order")
            dispatch(deleteOrderReset())
            dispatch(getAllOrders())
        }
    },[isDeleted,isUpdated])

    const deleteButtonHandler = (id) => {
        dispatch(deleteOrder(id))
    }
    const updateButtonHandler = (id,status) => {
        dispatch(updateOrderStatus(id,status))
    }
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
            renderCell: (params) => {
                return (
                    <div style={{ color: params.row.status === "Delivered" ? "green" : "red" }}>
                        {params.row.status}
                    </div>
                );
            }
            //for some reason with the below method styles are not being applied properly
            // cellClassName : (params) => {
            //     return params.row.status == "Delivered" ? "greenColor" : "redColor"
            // }
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
            flex : 0.5,
            headerName : "Actions",
            minWidth : 150,
            type : "number",
            sortable : false,
            renderCell : (params) => {
                return (
                    <>
                    <Button>
                    <Link className="linkToOrderDetails" to={`order/${params.row.id}`}>
                        <Launch/>
                    </Link>
                    </Button>
                    <Button onClick={()=>{
                        if(params.row.status == "Processing"){
                            updateButtonHandler(params.row.id,"Shipped")
                        }
                        else if(params.row.status == "Shipped"){
                            updateButtonHandler(params.row.id,"Delivered")
                        }
                        else{
                            alert.error("The order is already Delivered!")
                        }
                    }}>
                        <LocalShipping/>
                    </Button>
                    <Button onClick={()=>{
                        deleteButtonHandler(params.row.id)
                    }}>
                        <Delete/>
                    </Button>
                    </>
                )
            }
        }
    ]
    if(orders && orders.length != 0)
    {
        orders.forEach((item, index) => {
            rows.push({
                id : item._id,
                itemsQty : item.orderItems.length,
                status : item.orderStatus,
                amount : item.totalPrice
            })
        });
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
    if(allOrdersLoading){
        return (
            <>
            <div className="loadingScreen">
               <Loader/>
            </div>
            </>
        )
    }
    if(orderLoading){
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
                <div className="orderListContainer">
                    <h1 id="orderListHeading">ALL ORDERS</h1>

                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      disableRowSelectionOnClick
                      className="orderListTable"
                      autoHeight
                    />
                </div>
            </div>
            </>
        }
        </>
    )
}


export default OrderList