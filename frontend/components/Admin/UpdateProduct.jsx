import "./UpdateProduct.css"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAlert } from "react-alert"
import { useSelector, useDispatch } from "react-redux"
import Loader from "../Loader/Loader"
import SideBar from "./SideBar"
import { clearErrors, getProductDetails, updateProduct, resetUpdateProduct } from "../../src/redux-store/actions/productAction"
import { Button } from "@material-ui/core"
import { AccountTree, Description, Storage, Spellcheck, AttachMoney, Category } from "@mui/icons-material"


function UpdateProduct(){
    const {id} = useParams()
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
            navigate("/login?redirect=admin/product/"+id)
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

    const {loading : ogProductLoad, product, error : ogError} = useSelector((state)=>{
        return state.productDetails
    })
    const {loading, isUpdated, error} = useSelector((state)=>{
        return state.updateProduct
    })
    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(isUpdated){
            alert.success("Product Updated Successfully")
            dispatch(resetUpdateProduct())
            navigate("/admin/dashboard")
        }
        if(ogError){
            alert.error(ogError)
            dispatch(clearErrors())
            navigate("/admin/dashboard")
        }
    },[ogError,error,isUpdated])
    useEffect(()=>{
        if(product && product._id != id){
            dispatch(getProductDetails(id))
        }
    },[])



    const [name,setName] = useState("")
    const [price,setPrice] = useState()
    const [description,setDescription] = useState("")
    const [category,setCategory] = useState("")
    const [stock,setStock] = useState()
    const [images,setImages] = useState([])
    const [imagesPreview,setImagesPreview] = useState([])
    const categories = ["Laptop","Footwear","Bottom","Tops","Attire","Camera","Smart Phones"]
    useEffect(()=>{
        if(product.name){
            setName(product.name)
            setPrice(product.price)
            setDescription(product.description)
            setCategory(product.category)
            setStock(product.stock)
            product.images.forEach((image)=>{
                setImagesPreview((oldStateOfImagesPreview)=>{
                    return [...oldStateOfImagesPreview, image.url]
                })
            })
        }
    },[product])

    const formSubmitHandler = (e) => {
        e.preventDefault()
        if(category == ""){
            alert.error("Please select a category!")
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
        dispatch(updateProduct(id,data))
    }
    const updateProductImagesChange = (e)=>{
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
    if(ogProductLoad){
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
            <div className="updateProductContainer">
                <form className="updateProductForm" encType="multipart/form-data" onSubmit={formSubmitHandler}>
                    <h1>Update Product</h1>

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
                        <select value={category} onChange={(e)=>{setCategory(e.target.value)}}>
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
                    <div id="updateProductFormFile">
                        <input
                          type = "file"
                          name="photos"
                          accept="image/*"
                          multiple
                          onChange={updateProductImagesChange}
                        />
                    </div>
                    <div id="updateProductFormImage">
                        {imagesPreview.map((image,index)=>(
                            <img key={index} src={image} alt="Photo Preview"/>
                        ))}
                    </div>
                    <Button
                      id="updateProductBtn"
                      type="submit"
                      disabled = {loading}
                    >Update</Button>
                </form>
            </div>
        </div>
        </>
    )
}

export default UpdateProduct