import React, {useState} from 'react'
import {data, useLocation, useNavigate} from "react-router";
import ProductCard from "../components/ProductCard.jsx";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {useProductContext} from "../context/ProductContext.jsx";

const UpdateProduct = ({setUpdateNotification}) => {
    const id = useLocation().state;
    const [image, setImage] = useState();
    const [imageUploaded, setImageUploaded] = useState(false);
    const navigate = useNavigate();
    const [updatedProduct, setUpdatedProduct] = useState({
        name: "",
        category: "",
        brand: "",
        description: "",
        price: "",
        productAvailable: "",
        releaseDate: "",
        stockQuantity: ""
    });

    const {updateProductMutation} = useProductContext();

    const notify  = ()=>toast("Updated Product!!")
    const fetchProduct = async (id) => {
        const res = await axios.get(`http://localhost:8080/api/product/${id}`).then(res => res.data);
        const resImage = await axios.get(`http://localhost:8080/api/product/${id}/image`, {responseType: "blob"}).then(res => res.data);
        const imageFile = await convertUrlToFile(resImage, res.imageName);
        setImage(imageFile);
        setUpdatedProduct(res);
        return res;
    }

    const convertUrlToFile = async (blobData, fileName) => {
        const file = new File([blobData], fileName, {type: blobData.type})
        return file;
    }

    const {data: product, isLoading, isError, error} = useQuery({
        queryFn: () => fetchProduct(id),
        queryKey: ['product']
    })


    const onChangeHandler = (e) => {
        const {name, value} = e.target //get the name attribute from the html and value
        setUpdatedProduct({
            ...updatedProduct,
            [name]: value //[name], [ ] is used for dynamically finding the actual obj property name
        })
    }

    const onChangeImageHandler = (file) => {
        setImageUploaded(true)
        setImage(file);
    }

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        const submittedProduct = {"product": {}, "imageFile": ""};
        submittedProduct.product = new Blob([JSON.stringify(updatedProduct)], {type: "application/json"});
        submittedProduct.imageFile = image;
        console.log(submittedProduct);
        try{
            await updateProductMutation({id:id, submittedProduct:submittedProduct});
        }catch (error){
            console.log(error);
        }

    }

    console.log(updatedProduct, image);
    return (
        <div className="w-full   md:flex justify-center md:items-center">
            <ToastContainer/>
            <form onSubmit={handleFormSubmission}
                  className="max-w-[90vw] md:px-4 md:grid md:grid-cols-1 md:justify-center md:gap-6 md:min-w-[70%] md:items-center flex flex-col gap-2 text-gray-700 md:mb-5">
                <div className="md:w-full shadow-2xs flex flex-col gap-0">
                    {/*name*/}
                    <label htmlFor={'name'} className="text-[1.2em] font-medium">Name</label>
                    <input name={'name'} className=" md:w-full min-h-1/2 md: text px-2 rounded-sm bg-blue-200
                     py-1 outline-neutral-700 border-gray-700 focus-within:outline-2
                      focus-within:-outline-offset-2 focus-within:outline-indigo-500 " required
                           onChange={(e) => onChangeHandler(e)}
                           type={"text"}
                           value={updatedProduct.name}
                           placeholder="Product Name"/>
                </div>
                <div className="shadow-2xs flex flex-col gap-1">
                    {/*image*/}
                    <label htmlFor={'image'}>Product Image</label>
                    <div
                        className="px-2 border-black rounded-sm w-full aspect-square justify-center items-center h-[200px]">
                        <img className="h-full" src={image ? URL.createObjectURL(image) : ''} alt="product Image"/>
                    </div>

                    <input className="placeholder-blue-800  min-h-1/2 text px-2 rounded-sm bg-blue-200
                     py-1 outline-neutral-700 border-gray-700 focus-within:outline-2
                      focus-within:-outline-offset-2 focus-within:outline-indigo-500"
                           onChange={(e) => onChangeImageHandler(e.target.files[0])}
                           type={'file'} accept={"image/*"}/>
                </div>
                <div className="shadow-2xs flex flex-col gap-0">
                    {/*brand*/}
                    <label htmlFor={'brand'} className="text-[1.2em] font-medium">Brand</label>
                    <input className=" min-h-1/2 text px-2 rounded-sm bg-blue-200
                     py-1 outline-neutral-700 border-gray-700 focus-within:outline-2
                      focus-within:-outline-offset-2 focus-within:outline-indigo-500 "
                           name={'brand'}
                           value={updatedProduct.brand}
                           onChange={(e) => onChangeHandler(e)}
                           placeholder='Brand Name'/>
                </div>
                <div className="shadow-2xs flex flex-col gap-0">
                    {/*category*/}
                    <label htmlFor={'category'} className="text-[1.2em] font-medium">Category</label>
                    <select className="max-h-[50px]  px-2 rounded-sm bg-blue-200
                     py-1 outline-neutral-700 border-gray-700 focus-within:outline-2 overflow-scroll
                      focus-within:-outline-offset-2 focus-within:outline-indigo-500 "
                            name={"category"}
                            onChange={(e) => onChangeHandler(e)}
                            value={updatedProduct.category}>
                        <option value="">Select category</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Headphone">Headphone</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Toys">Toys</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Home">Home</option>
                        <option value="Fitness">Fitness</option>
                    </select>
                </div>
                <div className="shadow-2xs flex flex-col gap-0">
                    {/*price*/}
                    <label htmlFor={'price'} className="text-[1.2em] font-medium">Price</label>
                    <input className=" md:w-full min-h-1/2 md: text px-2 rounded-sm bg-blue-200
                     py-1 outline-neutral-700 border-gray-700 focus-within:outline-2
                      focus-within:-outline-offset-2 focus-within:outline-indigo-500 "
                           type={'number'} min={'0'} placeholder="Price Of The Product in $"
                           name={'price'}
                           step={0.01}
                           onChange={(e) => onChangeHandler(e)}
                           value={updatedProduct.price}/>
                </div>
                <div className="shadow-2xs flex flex-col gap-0">
                    {/*releaseDate*/}
                    <label htmlFor={'releaseDate'} className="text-[1.2em] font-medium">Release Date</label>
                    <input className=" md:w-full min-h-1/2 md: text px-2 rounded-sm bg-blue-200
                     py-1 outline-neutral-700 border-gray-700 focus-within:outline-2
                      focus-within:-outline-offset-2 focus-within:outline-indigo-500 " type={'date'}
                           max={new Date().toISOString().split('T')[0]}
                           name={'releaseDate'}
                           onChange={(e) => onChangeHandler(e)}
                           value={updatedProduct.releaseDate}
                           placeholder="Select Date"/>
                </div>
                <div className="shadow-2xs flex flex-col gap-0">
                    {/*description*/}
                    <label htmlFor={'description'} className="text-[1.2em] font-medium">Description</label>
                    <textarea className=" md:w-full min-h-1/2 md: text px-2 rounded-sm bg-blue-200
                     py-1 outline-neutral-700 border-gray-700 focus-within:outline-2
                      focus-within:-outline-offset-2 focus-within:outline-indigo-500 "
                              value={updatedProduct.description}
                              name={'description'}
                              onChange={(e) => onChangeHandler(e)}
                              placeholder="Discription Of The Product"/>
                </div>
                <div className="shadow-2xs flex flex-col gap-0">
                    {/*available*/}
                    <label htmlFor={'productAvailable'} className="text-[1.2em] font-medium">Available</label>
                    <select className=" md:w-full min-h-1/2 md: text px-2 rounded-sm bg-blue-200
                     py-1 outline-neutral-700 border-gray-700 focus-within:outline-2
                      focus-within:-outline-offset-2 focus-within:outline-indigo-500 "
                            value={updatedProduct.productAvailable}
                            name={'productAvailable'}
                            onChange={(e) => onChangeHandler(e)}
                    >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                </div>
                <div className="shadow-2xs flex flex-col gap-0">
                    {/*stocks*/}
                    <label htmlFor={'stockQuantity'} className="text-[1.2em] font-medium">Stocks</label>
                    <input className=" md:w-full min-h-1/2 md: text px-2 rounded-sm bg-blue-200
                     py-1 outline-neutral-700 border-gray-700 focus-within:outline-2
                      focus-within:-outline-offset-2 focus-within:outline-indigo-500 " type={"number"} min={'0'}
                           step={1}
                           name={'stockQuantity'}
                           value={updatedProduct.stockQuantity}
                           onChange={(e) => onChangeHandler(e)}
                           placeholder="Stocks Of The Product You Have"/>
                </div>
                <div className="w-full flex justify-center items-center">
                    <button type={'submit'}
                            className="px-4 py-2 bg-orange-400 text-white max-w-1/3 rounded-md ">Update
                    </button>

                </div>
            </form>

        </div>
    )
}
export default UpdateProduct
