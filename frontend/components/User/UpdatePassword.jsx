import "./UpdatePassword.css"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Loader from "../Loader/Loader"
import {LockOpen, Lock, VpnKey} from "@mui/icons-material"
import { clearErrors, resetUpdatePassword, updatePassword } from "../../src/redux-store/actions/userAction"
import { useAlert } from "react-alert"

function UpdatePassword()
{
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const alert = useAlert()
    const {loading,isAuthenticated} = useSelector((state)=>{
        return state.user
    })
    const {loading : updateLoading,isUpdated,error} = useSelector((state)=>{
        return state.profile
    })
    useEffect(()=>{
        if((loading == false)&&(isAuthenticated == false))
        {
            // navigate("/login")
            navigate("/login?redirect=password/update")
        }
    },[isAuthenticated])
    
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const updatePasswordSubmit = (e)=>{
        e.preventDefault()
        const myform = {
            oldPassword,
            newPassword,
            confirmPassword
        }
        dispatch(updatePassword(myform))
    }
    const updatePasswordDataChange = (e)=>{
        if(e.target.name == "oldPassword")
        {
            setOldPassword(e.target.value)
        }
        if(e.target.name == "newPassword")
        {
            setNewPassword(e.target.value)
        }
        if(e.target.name == "confirmPassword")
        {
            setConfirmPassword(e.target.value)
        }
    }
    useEffect(()=>{
        if(error)
        {
            alert.error(error)
            dispatch(clearErrors())
        }
        if(isUpdated)
        {
            alert.success("Password Updated Successfully")
            navigate("/account")
            dispatch(resetUpdatePassword())
        }
    },[isUpdated, error])
    if(loading)
    {
        return (
            <>
            <div className="loadingScreen">
                <Loader/>
            </div>
            </>
        )
    }
    if(updateLoading)
    {
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
        <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
                <h2>Change Password</h2>
                <form className="updatePasswordForm" encType="multipart/form-data" onSubmit={updatePasswordSubmit}>
                    <div className="updatePasswordOldPassword">
                        <Lock/>
                        <input type="password" placeholder="Old Password" required name="oldPassword" value={oldPassword}
                        onChange={(e)=>{updatePasswordDataChange(e)}}/>
                    </div>
                    <div className="updatePasswordNewPassword">
                        <LockOpen/>
                        <input type="password" placeholder="New Password" required name="newPassword" value={newPassword}
                        onChange={(e)=>{updatePasswordDataChange(e)}}/>
                    </div>
                    <div className="updatePasswordConfirmPassword">
                        <VpnKey/>
                        <input type="password" placeholder="Confirm Password" required name="confirmPassword" value={confirmPassword}
                        onChange={(e)=>{updatePasswordDataChange(e)}}/>
                    </div>
                    <input type="submit" value="Change Password" className="updatePasswordBtn"/>
                </form>
            </div>
        </div>
        </>
    )
}


export default UpdatePassword