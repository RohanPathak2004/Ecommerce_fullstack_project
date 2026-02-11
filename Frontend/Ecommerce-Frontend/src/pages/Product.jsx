import React, {useState} from 'react'
import {Link, useLocation, useNavigate} from "react-router";
import noimage from "../assets/noimage.png";
import {ToastContainer, toast} from 'react-toastify';
import axios from "axios";
import {useProductContext} from "../context/ProductContext.jsx";
import {useCartContext} from "../context/CartContext.jsx";

const Product = ({setAddedToCart}) => {
    const location = useLocation();
    const product = location.state
    const [askClientForDeletion, setAskClientForDeletion] = useState(false);
    const navigate = useNavigate();
    const {deleteProductMutation} = useProductContext();
    const {addProductToCart} = useCartContext();
    const handleProductDeletion = async () => {
        if (askClientForDeletion) {
            try {
                await deleteProductMutation(product.id);
            }catch (e) {
                console.log(e.message());
            }
        }
    }


    return (
        <div className="min-w-full p-4">
            <ToastContainer/>
            {/* Deletion Modal */}
            {askClientForDeletion && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                        <h2 className="text-xl font-bold mb-4">Do You Want To Delete This Product?</h2>
                        <div className="w-full px-4 flex justify-evenly">
                            <button onClick={handleProductDeletion}
                                    className="bg-green-600 text-white text-[1.1rem] px-4 py-1 rounded-md cursor-pointer hover:bg-green-700">
                                Yes
                            </button>
                            <button onClick={() => setAskClientForDeletion(false)}
                                    className="bg-red-500 text-white text-[1.1rem] px-4 py-1 rounded-md cursor-pointer hover:bg-red-600">
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Product Container */}
            <div className="max-w-6xl mx-auto mt-6 flex flex-col md:flex-row gap-8 items-center md:items-start">

                {/* Image Section */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <div
                        className="relative w-full aspect-square max-h-[40vh] md:max-h-[50vh] overflow-hidden rounded-xl bg-gray-50 flex justify-center items-center shadow-md">
                        <img
                            className="h-[90%] w-auto object-contain"
                            src={`data:${product.imageType};base64,${product.imageData}`}
                            alt={product.name || 'Product Image'}
                            onError={(e) => {
                                e.target.src = noimage;
                            }}
                        />
                    </div>
                </div>


                <div className="w-full md:w-1/2 flex flex-col gap-4 text-gray-700">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-black">{product.name}</h1>
                        <div className="flex items-center gap-3 mt-2">
                    <span
                        className={`text-white px-3 py-1 rounded-md text-sm font-medium ${product.productAvailable ? "bg-green-500" : "bg-red-500"}`}>
                        {product.productAvailable ? "Available" : "Currently not Available"}
                    </span>
                            <span className="px-3 py-1 bg-gray-400 text-white rounded-md text-sm font-medium">
                        {product.category}
                    </span>
                        </div>
                    </div>

                    <div className="text-3xl font-bold text-black">${product.price}</div>

                    <div className="space-y-2">
                        <p><span className="font-bold">Brand: </span>
                            <span className={!product.brand ? 'text-red-500' : ''}>
                        {product.brand ? product.brand.toWellFormed() : 'Not Found'}
                    </span>
                        </p>
                        <p><span className="font-bold">Release Date: </span> {product.releaseDate}</p>
                        <p className="leading-relaxed">
                            <span className="font-bold">Description: </span> {product.description}
                        </p>
                    </div>


                    <div className="flex flex-col gap-3 mt-4">
                        <button
                            disabled={!product.productAvailable||product.stockQuantity===0}
                            onClick={()=>{
                                toast("Product Added To Cart");
                                addProductToCart({
                                    productId:product.id,
                                    quantity:1
                                })
                            }}
                            className="w-full md:w-2/3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-semibold transition-colors"
                        >
                            Add to Cart
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setAskClientForDeletion(true)}
                                className="flex-1 md:flex-none md:px-10 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                            >
                                Delete
                            </button>
                            <Link
                                to={`/product/update/${product.id}`}
                                state={product.id}
                                className="flex-1 md:flex-none md:px-10 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-xl text-center transition-colors"
                            >
                                Update
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}
export default Product
