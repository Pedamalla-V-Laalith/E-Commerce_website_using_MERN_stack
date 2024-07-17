import React from "react";
import { ReactNavbar } from "overlay-navbar"
import {MdAccountCircle } from "react-icons/md";
import {MdSearch } from "react-icons/md";
import {MdAddShoppingCart } from "react-icons/md";
import logo from "../../../images/logo.png"
const Header = () =>{
    return (
        <>
        <ReactNavbar 
            // burgerColor = "#eb4034"
            logoAnimationTime = {0.8}
            nav1Transition = {0.2}
            nav2Transition = {0.4}
            nav3Transition = {0.6}
            nav4Transition = {0.8}
            link1Transition = {0.4}
            link2Transition = {0.4}
            link3Transition = {0.4}
            link4Transition = {0.4}
            link1AnimationTime = {0.3}
            link2AnimationTime = {0.6}
            link3AnimationTime = {0.9}
            link4AnimationTime = {1.2}
            searchIconAnimationTime = {1}
            profileIconAnimationTime = {1.2}
            cartIconAnimationTime = {1.2}
            burgerColorHover = "#a62d24"
            logo = {logo}
            logoWidth = "20vmax"
            navColor1 = "white"
            logoHoverSize = "10px"
            logoHoverColor = "eb4034"
            link1Text = "Home"
            link2Text = "Products"
            link3Text = "Contact"
            link4Text = "About"
            link1Url = "/"
            link2Url = "/products"
            link3Url = "/contact"
            link4Url = "/about"
            link1Size = "2vmax"
            link1Color = "rgba(35,35,35,0.7)"
            nav1justifyContent = "flex-end"
            nav2justifyContent = "flex-end"
            nav3justifyContent = "flex-start"
            nav4justifyContent = "flex-start"
            link1ColorHover = "#eb4034"
            link2ColorHover = "#eb4034"
            link3ColorHover = "#eb4034"
            link4ColorHover = "#eb4034"
            link1Margin = "0"
            link2Margin = "1vmax"
            link3Margin = "0"
            link4Margin = "1vmax"
            profileIcon = {true}
            ProfileIconElement = {MdAccountCircle}
            profileIconUrl ="/login"
            searchIcon = {true}
            SearchIconElement = {MdSearch}
            cartIcon = {true}
            CartIconElement = {MdAddShoppingCart}
            cartIconUrl = "/shoppingCart"
            profileIconColor = "rgb(35,35,35)"
            searchIconColor = "rgb(35,35,35)"
            cartIconColor = "rgb(35,35,35)"
            profileIconHover = "#eb4034"
            searchIconHover = "#eb4034"
            cartIconHover = "#eb4034"
            searchIconMargin = "0"
            profileIconMargin = "0"
            cartIconMargin = "1vmax"/>
        </>
    )
}

export default Header