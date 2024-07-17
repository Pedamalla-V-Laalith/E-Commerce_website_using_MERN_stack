import "./ResetPassword.css"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Loader from "../Loader/Loader"
import {LockOpen, VpnKey} from "@mui/icons-material"
import { clearErrors, resetPassword } from "../../src/redux-store/actions/userAction"
import { useAlert } from "react-alert"

function ResetPassword()
{
    const {token} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const alert = useAlert()
    const {loading, success, error} = useSelector((state)=>{
        return state.forgotPassword;
    })
    
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const resetPasswordSubmit = (e)=>{
        e.preventDefault()
        const myform = {
            password,
            confirmPassword
        }
        dispatch(resetPassword(token,myform))
    }
    const resetPasswordDataChange = (e)=>{
        if(e.target.name == "password")
        {
            setPassword(e.target.value)
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
        if(success)
        {
            alert.success("Password Reset Successfull!")
            window.location = "/"
        }
    },[success, error])
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

    return (
        <>
        <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
                <h2>Reset Password</h2>
                <form className="resetPasswordForm" encType="multipart/form-data" onSubmit={resetPasswordSubmit}>
                    <div className="resetPasswordNewPassword">
                        <LockOpen/>
                        <input type="password" placeholder="New Password" required name="password" value={password}
                        onChange={(e)=>{resetPasswordDataChange(e)}}/>
                    </div>
                    <div className="resetPasswordConfirmPassword">
                        <VpnKey/>
                        <input type="password" placeholder="Confirm Password" required name="confirmPassword" value={confirmPassword}
                        onChange={(e)=>{resetPasswordDataChange(e)}}/>
                    </div>
                    <input type="submit" value="Reset Password" className="resetPasswordBtn"/>
                </form>
            </div>
        </div>
        </>
    )
}


export default ResetPassword