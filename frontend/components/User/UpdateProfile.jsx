import "./UpdateProfile.css"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Loader from "../Loader/Loader"
import {MailOutline, Face} from "@mui/icons-material"
import { clearErrors, loadUser, resetUpdateProfile, updateProfile } from "../../src/redux-store/actions/userAction"
import { useAlert } from "react-alert"
import profilePng from "../../../images/userprofile.png"

function UpdateProfile()
{
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const alert = useAlert()
    const {loading,isAuthenticated,user} = useSelector((state)=>{
        return state.user
    })
    const {loading : updateLoading,isUpdated,error} = useSelector((state)=>{
        return state.profile
    })
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState(profilePng)
    useEffect(()=>{
        if((loading == false)&&(isAuthenticated == false))
        {
            // navigate("/login")
            navigate("/login?redirect=me/update")
        }
    },[isAuthenticated])
    useEffect(()=>{
        if(user)
        {
            if(user.name)
            {
                //this is to rectify a bug while refreshing the update page
                //since the initial state is having user but it is an empty object
                //to ensure it reads the name,email,avatar correctly we are making
                //sure that they exist in the first place
                setName(user.name)
                setEmail(user.email)
                setAvatarPreview(user.avatar.url)
            }
        }
    },[user])
    const updateProfileSubmit = (e)=>{
        e.preventDefault()
        const myform = {
            name,
            email,
            avatar
        }
        dispatch(updateProfile(myform))
    }
    const updateProfileDataChange = (e)=>{
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
        if(e.target.name == "name")
        {
            setName(e.target.value)
        }
        if(e.target.name == "email")
        {
            setEmail(e.target.value)
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
            alert.success("Profile Updated Successfully")
            dispatch(loadUser())
            navigate("/account")
            dispatch(resetUpdateProfile())
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
        <div className="updateProfileContainer">
            <div className="updateProfileBox">
                <h2>Update Profile</h2>
                <form className="updateProfileForm" encType="multipart/form-data" onSubmit={updateProfileSubmit}>
                    <div className="updateProfileName">
                        <Face/>
                        <input type="text" placeholder="Name" required name="name" value={name}
                        onChange={(e)=>{updateProfileDataChange(e)}}/>
                    </div>
                    <div className="updateProfileEmail">
                        <MailOutline/>
                        <input type="email" placeholder="Email" required name="email" value={email}
                        onChange={(e)=>{updateProfileDataChange(e)}}/>
                    </div>
                    <div id="updateImage" className="updateImage">
                        <img src={avatarPreview} alt="Avatar Preview"/>
                        <div><input className="imageupload" type="file" name="avatar" accept="image/"
                        onChange={(e)=>{updateProfileDataChange(e)}}/></div>
                    </div>
                    <input type="submit" value="Update Profile" className="updateProfileBtn"/>
                </form>
            </div>
        </div>
        </>
    )
}


export default UpdateProfile