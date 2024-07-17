import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Search.css"


function Search({history})
{
    const navigate = useNavigate()
    const [keyword,setKeyword] = useState("")
    const searchSubmitHandler = (e) => {
        e.preventDefault()//this will result in the page not reloading. because when we submit a form the page reloads
        //if someone enters a blank input then keyword.trim() will be null
        if(keyword.trim())
        {
            navigate(`/products/${keyword}`)
        }
        else
        {
            navigate("/products")
        }
    }
    return (
        <>
        <form className="searchBox" onSubmit={searchSubmitHandler}>
            <input type="text" placeholder="Search a Product"
            onChange={(e)=>{
                setKeyword(e.target.value)
            }}/>
            <input type="submit" value="Search"/>
        </form>
        </>
    )
}


export default Search