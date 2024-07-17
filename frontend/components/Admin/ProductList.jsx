import "./ProductList.css"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAlert } from "react-alert"
import { useSelector, useDispatch } from "react-redux"
import Loader from "../Loader/Loader"
import SideBar from "./SideBar"
import { DataGrid } from "@mui/x-data-grid"
import { getAdminProducts, clearErrors, deleteProduct, resetDeleteProduct } from "../../src/redux-store/actions/productAction"
import { Delete, Edit } from "@mui/icons-material"
import { Button } from "@material-ui/core"

function ProductList()
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
            navigate("/login?redirect=admin/products")
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
    useEffect(()=>{
        dispatch(getAdminProducts())
    },[])
    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
    },[error])
    const {loading : deletionLoading, isDeleted, error : deletionError} = useSelector((state)=>{
        return state.deleteProduct
    })
    const deleteButtonHandler = (id) => {
        dispatch(deleteProduct(id))
    }
    useEffect(()=>{
        if(deletionError){
            alert.error(deletionError)
            dispatch(clearErrors())
        }
    },[deletionError])
    useEffect(()=>{
        if(isDeleted){
            alert.success("Product deleted Successfully")
            dispatch(resetDeleteProduct())
            dispatch(getAdminProducts())
        }
    },[isDeleted])
    const columns = [
        {
            field : "id",
            headerName : "Product ID",
            minWidth : 200,
            flex : 0.5
        },
        {
            field : "name",
            headerName : "Name",
            minWidth : 350,
            flex : 1
        },
        {
            field : "stock",
            headerName : "Stock",
            type : "number",
            minWidth : 150,
            flex : 0.3
        },
        {
            field : "price",
            headerName : "Price",
            type : "number",
            minWidth : 270,
            flex : 0.5
        },
        {
            field : "actions",
            headerName : "Actions",
            type : "number",
            minWidth : 150,
            flex : 0.3,
            sortable : false,
            renderCell : (params) => {
                return (
                    <>
                    {/* in the below function params.id returns the current row id */}
                    <Link to={`/admin/product/${params.row.id}`}>
                        <Edit/>
                    </Link>

                    <Button onClick={()=>{deleteButtonHandler(params.row.id)}} disabled={deletionLoading}>
                        <Delete/>
                    </Button>
                    </>
                )
            }
        }
    ]
    const rows = products.map((product)=>{
        let row = {
            id : product._id,
            name : product.name,
            stock : product.stock,
            price : product.price
        }
        return row
    })

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
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>

                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      disableRowSelectionOnClick
                      className="productListTable"
                      autoHeight
                    />
                </div>
            </div>
            </>
        }
        </>
    )
}


export default ProductList