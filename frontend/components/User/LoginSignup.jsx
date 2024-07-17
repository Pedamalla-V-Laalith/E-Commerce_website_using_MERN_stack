import "./LoginSignup.css"
import { useRef } from "react"
import Loader from "../Loader/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {MailOutline, LockOpen, Face} from "@mui/icons-material"
import profilePng from "../../../images/userprofile.png"
// import defaultAvatar from "../../../images/defaultAvatar.jpg"
import { useSelector, useDispatch } from "react-redux"
import {login, signup, clearErrors} from "../../src/redux-store/actions/userAction"
import { useAlert } from "react-alert"

function LoginSignup()
{
    const navigate = useNavigate()
    const alert = useAlert()
    const dispatch = useDispatch()
    const {loading, isAuthenticated,error} = useSelector((state)=>{
        return state.user
    })

    const loginTab = useRef(null)
    const signupTab = useRef(null)
    const switcherTab = useRef(null)
    const[loginEmail,setLoginEmail] = useState("")
    const[loginPassword,setLoginPassword] = useState("")
    const [signupUser,setSignupUser] = useState({
        name : "",
        email : "",
        password : ""
    })
    const {name,email,password} = signupUser
    const [avatar,setAvatar] = useState("defaultAvatar")
    const [avatarPreview, setAvatarPreview] = useState(profilePng)
    
    useEffect(()=>{
        if(error)
        {
            alert.error(error)
            dispatch(clearErrors())
        }
        if(isAuthenticated)
        {
            // navigate("/account")
            const redirect = location.search ? location.search.split("=")[1]/*getting the word after =*/: "account"
            /*
            In a web browser, location.search returns the query string of the current URL. The query string is everything in the URL after the ? character.
            */
            navigate(`/${redirect}`)
            /*
            we did all this because sometimes some pages need to authenticated
            users to access the resources. In order to ensure that they are authenticated
            we already use isAuthenticated variable. But initially it is set to false
            so if a user directly reaches that page he will be directed to login page (this page)
            and if the user token already exists in cookies he will be diverted to /account in the previous version of code.
            but now we are using the technique of redirect (check Shipping.jsx, UpdatePassword.jsx or UpdateProfile.jsx for an example perhaps) 
            to ensure that routes which require authentication if they divert user to this page and if the user is already authenticated, 
            then this redirect technique will help user to get back to the page on which he wanted to go instead of just /account.
            but of course if the redirect query is not present then the user will by default go to account if he is authenticated already.
            */
        }
    },[error,isAuthenticated])

    const switchTabs = (e,tab)=>{
        if(tab == "login")
        {
            switcherTab.current.classList.add("shiftToNeutral")
            switcherTab.current.classList.remove("shiftToRight")

            signupTab.current.classList.remove("shiftToNeutralForm")
            loginTab.current.classList.remove("shiftToLeft")
        }
        if(tab == "signup")
        {
            switcherTab.current.classList.remove("shiftToNeutral")
            switcherTab.current.classList.add("shiftToRight")

            signupTab.current.classList.add("shiftToNeutralForm")
            loginTab.current.classList.add("shiftToLeft")
        }
    }

    const loginSubmit = (e)=>{
        e.preventDefault()
        dispatch(login(loginEmail,loginPassword))
    }
    const signupSubmit = (e)=>{
        e.preventDefault()
        
        // const myform = new FormData()
        // myform.set("name",name)
        // myform.set("email",email)
        // myform.set("password",password)
        // myform.set("avatar",avatar)
        const myform = {
            name,
            email,
            password,
            avatar
        }
        dispatch(signup(myform))
    }

    const signupDataChange = (e)=>{
        if(e.target.name == "avatar")
        {
            //since we have read a file now
            const reader = new FileReader()
            reader.onload = ()=>{
                //basically reading a file has 3 states 0,1,2
                //0->initial, 1->processing, 2->done
                if(reader.readyState == 2)
                {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }
            //the reader.onload function should only be called once the file upload is done
            reader.readAsDataURL(e.target.files[0])
        }
        else
        {
            setSignupUser({
                ...signupUser,
                [e.target.name] : e.target.value
            })
        }
    }

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
        <div className="LoginSignupContainer">
            <div className="LoginSignupBox">
                <div>
                    <div className="login_signup_toggle">
                        <p onClick={(e)=>switchTabs(e,"login")}>Login</p>
                        <p onClick={(e)=>switchTabs(e,"signup")}>Signup</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>


                <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                    <div className="loginEmail">
                        <MailOutline/>
                        <input type="email" placeholder="Email" required value={loginEmail}
                        onChange={(e)=>{setLoginEmail(e.target.value)}}/>
                    </div>
                    <div className="loginPassword">
                        <LockOpen/>
                        <input type="password" placeholder="Password" required value={loginPassword}
                        onChange={(e)=>{setLoginPassword(e.target.value)}}/>
                    </div>
                    <Link to="/password/forgot">Forgot Password?</Link>
                    <input type="submit" value="Login" className="loginBtn"/>
                </form>


                <form className="signupForm" ref={signupTab} encType="multipart/form-data" onSubmit={signupSubmit}>
                    <div className="signupName">
                        <Face/>
                        <input type="text" placeholder="Name" required name="name" value={name}
                        onChange={(e)=>{signupDataChange(e)}}/>
                    </div>
                    <div className="signupEmail">
                        <MailOutline/>
                        <input type="email" placeholder="Email" required name="email" value={email}
                        onChange={(e)=>{signupDataChange(e)}}/>
                    </div>
                    <div className="signupPassword">
                        <LockOpen/>
                        <input type="password" placeholder="Password" required name="password" value={password}
                        onChange={(e)=>{signupDataChange(e)}}/>
                    </div>
                    <div id="registerImage" className="registerImage">
                        <img src={avatarPreview} alt="Avatar Preview"/>
                        <div><input className="imageupload" type="file" name="avatar" accept="image/"
                        onChange={(e)=>{signupDataChange(e)}}/></div>
                    </div>
                    <input type="submit" value="Signup" className="signupBtn"/>
                </form>
            </div>
        </div>
        </>
    )
}


export default LoginSignup