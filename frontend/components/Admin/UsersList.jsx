import "./UsersList.css"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAlert } from "react-alert"
import { useSelector, useDispatch } from "react-redux"
import Loader from "../Loader/Loader"
import SideBar from "./SideBar"
import { getAllUsers, deleteUser, resetDeleteUser, clearErrors } from "../../src/redux-store/actions/userAction"
import { DataGrid } from "@mui/x-data-grid"
import { Delete, Edit } from "@mui/icons-material"
import { Button } from "@material-ui/core"

function UsersList() {
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
            navigate("/login?redirect=admin/users")
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

    const {loading, users, error} = useSelector((state) => {
        return state.allUsers
    })
    useEffect(() => {
        dispatch(getAllUsers())
    },[])
    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
    },[error])
    const {loading : deleteLoading, isDeleted, error : deleteError} = useSelector((state) => {
        return state.userUpdateAndDelete
    })
    const deleteButtonHandler = (id) => {
        dispatch(deleteUser(id))
    }
    useEffect(()=>{
        if(deleteError){
            alert.error(deleteError)
            dispatch(clearErrors())
        }
        if(isDeleted){
            alert.success("User Deleted Successfully!")
            dispatch(resetDeleteUser())
            dispatch(getAllUsers())
        }
    },[deleteError, isDeleted])


    const rows = []
    const columns = [
        {
            field : "id",
            headerName: "User Id",
            minWidth : 200,
            flex : 0.8,
            sortable : false
        },
        {
            field : "email",
            headerName : "Email",
            minWidth : 350,
            flex : 1,
            sortable : false
            // renderCell: (params) => {
            //     return (
            //         <div style={{ color: params.row.status === "Delivered" ? "green" : "red" }}>
            //             {params.row.status}
            //         </div>
            //     );
            // }
            //for some reason with the below method styles are not being applied properly
            // cellClassName : (params) => {
            //     return params.row.status == "Delivered" ? "greenColor" : "redColor"
            // }
        },
        {
            field : "name",
            headerName : "Name",
            minWidth : 270,
            flex : 0.5,
            sortable : false
        },
        {
            field : "role",
            headerName : "Role",
            minWidth : 150,
            flex : 0.5,
            renderCell : (params) => {
                return (
                    <>
                    <div className= {params.row.role == "admin" ? "greenColor" : "redColor"}>
                        {params.row.role}
                    </div>
                    </>
                )
            }
        },
        {
            field : "actions",
            flex : 0.8,
            headerName : "Actions",
            minWidth : 150,
            type : "number",
            sortable : false,
            renderCell : (params) => {
                if(params.row.id == user._id){
                    return (
                        <>
                        <div className="redColor">
                            RESTRICTED
                        </div>
                        </>
                    )
                }
                return (
                    <>                    
                    <Link to={`user/${params.row.id}`}>
                        <Button><Edit/></Button>
                    </Link>
                    
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
    if(users && users.length != 0)
    {
        users.forEach((item) => {
            rows.push({
                id : item._id,
                email : item.email,
                name : item.name,
                role : item.role
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
    if(deleteLoading){
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
                <div className="userListContainer">
                    <h1 id="userListHeading">ALL USERS</h1>

                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      disableRowSelectionOnClick
                      className="userListTable"
                      autoHeight
                    />
                </div>
            </div>
            </>
        }
        </>
    )
}


export default UsersList