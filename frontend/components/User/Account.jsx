import "./Account.css"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import Loader from "../Loader/Loader"


function Account()
{
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {loading,isAuthenticated,user} = useSelector((state)=>{
        return state.user
    })
    useEffect(()=>{
        if((loading == false)&&(isAuthenticated == false))
        {
            navigate("/login")
        }
    },[isAuthenticated])
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
    if(isAuthenticated)
    {
        return (
            <>
            <div className="profileContainer">

                <div className="leftcontainer">
                    <h1>My Profile</h1>
                    <img src={user.avatar.url} alt={user.name}/>
                    <Link to="/me/update">Edit Profile</Link>
                </div>
                
                <div className="rightcontainer">
                <div>
                    <h4>Full Name</h4>
                    <p>{user.name}</p>
                </div>
                <div>
                    <h4>Email</h4>
                    <p>{user.email}</p>
                </div>
                <div>
                    <h4>Joined On</h4>
                    <p>{String(user.createdAt).substring(0,10)}</p>
                </div>
                <div className="buttons">
                    <Link to="/orders">My Orders</Link>
                    <Link to="/password/update">Change Password</Link>
                </div>
                </div>
            </div>
            </>
        )
    }
}

export default Account