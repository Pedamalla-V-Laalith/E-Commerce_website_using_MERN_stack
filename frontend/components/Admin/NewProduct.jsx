import "./NewProduct.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAlert } from "react-alert"
import { useSelector, useDispatch } from "react-redux"
import Loader from "../Loader/Loader"
import SideBar from "./SideBar"
import { clearErrors, createProduct, resetCreateProduct } from "../../src/redux-store/actions/productAction"
import { Button } from "@material-ui/core"
import { AccountTree, Description, Storage, Spellcheck, AttachMoney, Category } from "@mui/icons-material"


function NewProduct()
{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const alert = useAlert()
    const {loading : userLoading, isAuthenticated, user} = useSelector((state)=>{
        return state.user
    })
    useEffect(()=>{
        if((userLoading == false)&&(isAuthenticated == false))
        {
            // navigate("/login")
            navigate("/login?redirect=admin/product")
        }
    },[isAuthenticated,userLoading])
    useEffect(()=>{
        if((!userLoading) && isAuthenticated){
            if(user.role != "admin"){
                navigate("/")
                alert.error("Access denied")
            }
        }
    },[userLoading,isAuthenticated,user])



    const {loading,error,success} = useSelector((state)=>{
        return state.newProduct
    })
    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(success){
            alert.success("Product Created Successfully")
            dispatch(resetCreateProduct())
            navigate("/admin/dashboard")
        }
    },[error,success])

    const [name,setName] = useState("")
    const [price,setPrice] = useState()
    const [description,setDescription] = useState("")
    const [category,setCategory] = useState("")
    const [stock,setStock] = useState()
    const [images,setImages] = useState([])
    const [imagesPreview,setImagesPreview] = useState([])
    const categories = ["Laptop","Footwear","Bottom","Tops","Attire","Camera","Smart Phones"]

    const formSubmitHandler = (e) => {
        e.preventDefault()
        if(category == ""){
            alert.error("Please select a category!")
            return
        }
        if(images.length == 0){
            alert.error("Please upload product images")
            return
        }
        const data = {
            name,
            price,
            description,
            category,
            stock,
            images
        }
        dispatch(createProduct(data))
    }
    const createProductImagesChange = (e)=>{
        const files = Array.from(e.target.files)
        //The Array.from() method in Node.js is used to create a new array instance 
        //from an iterable object. It can be used to convert strings, arrays, maps, sets, 
        //and other iterable objects to arrays.
        setImages([])
        setImagesPreview([])
        files.forEach((file)=>{
            const reader = new FileReader()
            reader.onload = () => {
                if(reader.readyState == 2){
                    setImages((oldStateOfImages)=>{
                        return [...oldStateOfImages, reader.result]
                    })
                    setImagesPreview((oldStateOfImagesPreview)=>{
                        return [...oldStateOfImagesPreview, reader.result]
                    })
                }
            }
            reader.readAsDataURL(file)
        })
    }


    if(userLoading){
        return (
            <>
            <div className="loadingScreen">
               <Loader/>
            </div>
            </>
        )
    }
    if(loading){
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
        <div className="dashboard">
            <SideBar/>
            <div className="newProductContainer">
                <form className="createProductForm" encType="multipart/form-data" onSubmit={formSubmitHandler}>
                    <h1>Create Product</h1>

                    <div>
                        <Spellcheck/>
                        <input
                          type="text"
                          placeholder="Product Name"
                          required
                          value={name}
                          onChange={(e) => {setName(e.target.value)}}
                        />
                    </div>
                    <div>
                        <AttachMoney/>
                        <input
                          type="number"
                          placeholder="Price"
                          required
                          value={price}
                          onChange={(e)=>{setPrice(e.target.value)}}
                        />
                    </div>
                    <div>
                        <Description/>
                        <textarea
                          placeholder="Product Description"
                          required
                          value={description}
                          onChange={(e)=>{setDescription(e.target.value)}}
                          cols="30"
                          rows="1"
                        />
                    </div>
                    <div>
                        <AccountTree/>
                        <select onChange={(e)=>{setCategory(e.target.value)}}>
                            <option value="">Choose Category</option>
                            {categories.map((cat)=>{
                                return (
                                    <option key={cat} value={cat}>{cat}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div>
                        <Storage/>
                        <input
                          type="number"
                          value={stock}
                          placeholder="Stock"
                          required
                          onChange={(e)=> setStock(e.target.value)}
                        />
                    </div>
                    <div id="createProductFormFile">
                        <input
                          type = "file"
                          name="photos"
                          accept="image/*"
                          multiple
                          onChange={createProductImagesChange}
                        />
                    </div>
                    <div id="createProductFormImage">
                        {imagesPreview.map((image,index)=>(
                            <img key={index} src={image} alt="Photo Preview"/>
                        ))}
                    </div>
                    <Button
                      id="createProductBtn"
                      type="submit"
                      disabled = {loading}
                    >Create</Button>
                </form>
            </div>
        </div>
        </>
    )
}

export default NewProduct