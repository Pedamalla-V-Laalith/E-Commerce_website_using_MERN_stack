import "./UpdateUser.css"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAlert } from "react-alert"
import { useSelector, useDispatch } from "react-redux"
import Loader from "../Loader/Loader"
import SideBar from "./SideBar"
import { getUserDetails,updateUser,resetUpdateUser, clearErrors } from "../../src/redux-store/actions/userAction"
import {MailOutline, AdminPanelSettings, Face} from "@mui/icons-material"
import { Button } from "@material-ui/core"


function UpdateUser(){
    const {id} = useParams()
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
            navigate(`/login?redirect=admin/users/user/${id}`)
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


    const {loading, userDetails, error} = useSelector((state) => {
        return state.userDetails
    })
    useEffect(()=>{
        dispatch(getUserDetails(id))
    },[])
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    useEffect(()=>{
        if(userDetails._id){
            setName(userDetails.name)
            setEmail(userDetails.email)
            setRole(userDetails.role)
        }
    },[userDetails])

    const {loading : updateLoading, isUpdated, error : updateError} = useSelector((state)=>{
        return state.userUpdateAndDelete
    })
    useEffect(()=>{
        if(isUpdated){
            alert.success("User Details Updated Successfully!")
            dispatch(resetUpdateUser())
            navigate("/admin/users")
        }
    },[isUpdated])

    const formSubmitHandler = (e) => {
        e.preventDefault()
        const userData = {
            name,
            email,
            role
        }
        dispatch(updateUser(id,userData))
    }

    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(updateError){
            alert.error(updateError)
            dispatch(clearErrors())
        }
    },[error, updateError])

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
    if(updateLoading){
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
                <div className="updateUserContainer">
                    <form className="updateUserForm" onSubmit={formSubmitHandler}>
                        <h1>UPDATE USER</h1>
                        <div className="updatedName">
                            <Face/>
                            <input type="text" placeholder="Name" required name="name" value={name}
                            onChange={(e)=>{setName(e.target.value)}}/>
                        </div>
                        <div className="updatedEmail">
                            <MailOutline/>
                            <input type="email" placeholder="Email" required name="email" value={email}
                            onChange={(e)=>{setEmail(e.target.value)}}/>
                        </div>
                        <div className="updatedRole">
                            <AdminPanelSettings/>
                            <select value={role} onChange={(e)=>{setRole(e.target.value)}}>
                                <option value = "user">User</option>
                                <option value = "admin">Admin</option>
                            </select>
                        </div>
                        <Button id="updateUserBtn" type="submit">Update</Button>
                    </form>
                </div>
            </div>
            </>
        }
        </>
    )
}


export default UpdateUser