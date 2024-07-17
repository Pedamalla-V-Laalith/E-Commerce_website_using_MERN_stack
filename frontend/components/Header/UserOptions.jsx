import { useState } from "react"
import "./Header.css"
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonIcon from '@mui/icons-material/Person'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ListAltIcon from '@mui/icons-material/ListAlt'
import {MdAddShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useAlert } from "react-alert"
import { logout } from "../../src/redux-store/actions/userAction"
import Backdrop from "@material-ui/core/Backdrop"

function UserOptions({user})
{
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const alert = useAlert()
    const [open ,setOpen] = useState(false)
    const options = [
        {icon : <ListAltIcon/>, tooltipTitle: "Orders", onClick : orders},
        {icon : <MdAddShoppingCart/>, tooltipTitle: "Cart", onClick : cart},
        {icon : <PersonIcon/>, tooltipTitle : "Profile", onClick : account},
        {icon : <ExitToAppIcon/>, tooltipTitle : "Logout", onClick : logoutUser}
    ]
    function dashboard()
    {
        navigate("/admin/dashboard")
    }
    function orders()
    {
        navigate("/orders")
    }
    function cart()
    {
        navigate("/shoppingCart")
    }
    function account()
    {
        navigate("/account")
    }
    function logoutUser()
    {
        dispatch(logout())
        alert.success("Logout Successfull")
        navigate("/")
    }
    return (
        <>
        <Backdrop open={open} style={{zIndex :10}}/>
        <SpeedDial
        style={{zIndex : 11}}
        className="speedDail"
        ariaLabel="SpeedDail tooltip example"
        onClose={()=> setOpen(false)}
        onOpen={()=> setOpen(true)}
        open={open}
        direction="down"
        icon = {<img className="profileImage" src={user.avatar.url} alt="Profile"/>}>
            {user.role == "admin" && <SpeedDialAction tooltipOpen={window.innerWidth <=600} icon={<DashboardIcon/>} tooltipTitle="Dashboard" onClick = {dashboard}/>}
            {options.map((option,i)=>{
                return (
                    <SpeedDialAction tooltipOpen={window.innerWidth <=600} key={i} {...option}/>
                )
            })}
        </SpeedDial>
        </>
    )
}

export default UserOptions