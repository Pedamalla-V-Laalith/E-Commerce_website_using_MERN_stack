import "./ForgotPassword.css"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Loader from "../Loader/Loader"
import {MailOutline} from "@mui/icons-material"
import { useAlert } from "react-alert"
import { clearErrors, forgotPassword } from "../../src/redux-store/actions/userAction"

function ForgotPassword()
{
    const {loading, message, error} = useSelector((state)=>{
        return state.forgotPassword;
    })
    const dispatch = useDispatch()
    const alert = useAlert()
    const [email,setEmail] = useState("")
    const submit = (e) => {
        e.preventDefault()
        dispatch(forgotPassword({email}))
    }
    useEffect(()=>{
        if(error)
        {
            alert.error(error)
            dispatch(clearErrors())
        }
        if(message)
        {
            alert.success(message)
        }
    },[error,message])
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
        <div className="forgotPasswordContainer">
            <div className="forgotPasswordBox">
                <h2>Forgot Password</h2>
                <form className="forgotPasswordForm" onSubmit={submit}>
                    <div className="forgotPasswordEmail">
                        <MailOutline/>
                        <input type="email" placeholder="Email" required name="email" value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}/>
                    </div>
                    <input type="submit" value="Get an E-mail of reset URL" className="forgotPasswordBtn"/>
                </form>
            </div>
        </div>
        </>
    )
}


export default ForgotPassword