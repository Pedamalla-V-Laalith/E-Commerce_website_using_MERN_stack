import "./Shipping.css"
import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {saveShippingInfo} from "../../src/redux-store/actions/cartAction"
import Loader from "../Loader/Loader"
import { PinDrop } from "@mui/icons-material"
import { Home } from "@mui/icons-material"
import { LocationCity } from "@mui/icons-material"
import { Public } from "@mui/icons-material"
import { Phone } from "@mui/icons-material"
import { TransferWithinAStation } from "@mui/icons-material"
import { Country, State }  from 'country-state-city'
import { useAlert } from "react-alert"
import CheckoutSteps from "./CheckoutSteps"

function Shipping()
{
    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {loading : userLoading ,isAuthenticated} = useSelector((state)=>{
        return state.user
    })
    const {shippingInfo} = useSelector((state)=>{
        return state.cart
    })
    useEffect(()=>{
        if((userLoading == false)&&(isAuthenticated == false))
        {
            navigate("/login?redirect=shipping")
        }
    },[isAuthenticated,userLoading])
    const [address, setAddress] = useState(shippingInfo.address)
    const [city, setCity] = useState(shippingInfo.city)
    const [state, setState] = useState(shippingInfo.state)
    const [country, setCountry] = useState(shippingInfo.country)
    const [pincode, setPincode] = useState(shippingInfo.pincode)
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo)

    const shippingSubmit = (e) => {
        e.preventDefault()
        if(phoneNo.length != 10)
        {
            alert.error("Phone number should be of 10 digits")
            return
        }
        const data = {
            address,
            city,
            state,
            country,
            pincode,
            phoneNo
        }
        dispatch(saveShippingInfo(data))
        navigate("/order/confirm")
    }

    if(userLoading)
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
        <CheckoutSteps activeStep={0} />
        <div className="shippingContainer">
            <div className="shippingBox">
                <h2 className="shippingHeading">Shipping Details</h2>

                <form className="shippingForm"
                encType="multipart/form-data"
                onSubmit={shippingSubmit}>

                    <div>
                        <Home/>
                        <input
                        type="text"
                        placeholder="Address"
                        required
                        value={address}
                        onChange={(e)=>{setAddress(e.target.value)}}/>
                    </div>
                    <div>
                        <LocationCity/>
                        <input
                        type="text"
                        placeholder="City"
                        required
                        value={city}
                        onChange={(e)=>{setCity(e.target.value)}}/>
                    </div>
                    <div>
                        <PinDrop/>
                        <input
                        type="number"
                        placeholder="Pincode"
                        required
                        value={pincode}
                        onChange={(e)=>{setPincode(e.target.value)}}/>
                    </div>
                    <div>
                        <Phone/>
                        <input
                        type="number"
                        placeholder="Phone No."
                        required
                        value={phoneNo}
                        onChange={(e)=>{setPhoneNo(e.target.value)}}/>
                    </div>
                    <div>
                        <Public/>
                        <select
                        required
                        value={country}
                        onChange={(e)=>{setCountry(e.target.value)}}>
                            <option value="">Country</option>
                            {Country && Country.getAllCountries().map((c)=>{
                                return <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                            })}
                        </select>
                    </div>
                    {country && (
                        <div>
                            <TransferWithinAStation/>
                            <select
                            required
                            value={state}
                            onChange={(e)=>{setState(e.target.value)}}>
                                <option value="">State</option>
                                {State && State.getStatesOfCountry(country).map((s)=>{
                                    return <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                })}
                            </select>
                        </div>
                    )}
                    {/* Please note that in js empty string is considered as false in boolean */}
                    <input
                    type="submit"
                    value="Continue"
                    className="shippingBtn"
                    disabled = {state ? false : true} />
                </form>
            </div>
        </div>
        </>
    )
}


export default Shipping