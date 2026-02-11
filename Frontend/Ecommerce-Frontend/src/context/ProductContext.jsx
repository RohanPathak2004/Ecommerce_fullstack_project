import {createContext, useContext} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {data, useNavigate} from "react-router";
import {toast} from "react-toastify";


const ProductContext = createContext();

export  const ProductProvider = ({children}) =>{

    const queryClient = useQueryClient();
    const navigate = useNavigate();



    const getProductImage = async (id) =>{
        const res = await axios.get(`http://localhost:8080/api/product/${id}/image`)
    }


    const {data: products, isLoading, isError, error} = useQuery({
        queryFn: () => axios.get('http://localhost:8080/api/products').then(res => res.data),
        queryKey: ["products"]
    });

    const deleteProduct = async (id) =>{
        const res = await axios.delete(`http://localhost:8080/api/product/${id}`);
        return res.data;
    }

    const addProduct = async (submittedProduct)=>{
        const res = await axios.post('http://localhost:8080/api/product',submittedProduct,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        })
        return res.data;
    }

    const updateProduct = async ({id, submittedProduct})=>{
        //don't use try and catch block inside this function.
            const res = await axios.put(`http://localhost:8080/api/product/${id}`, submittedProduct, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
        return res.data;
    }

    const {mutateAsync:updateProductMutation,isPending} = useMutation({
        mutationFn : updateProduct,  //mutationFn dont,t support multiple arguments instead use a object to pass multiple arguments
        onSuccess: ()=>{
            toast.success("Product Updated Successfully");
            queryClient.invalidateQueries({queryKey:["products"]})
            setTimeout(()=>{navigate('/');},2000);
        },
        onError:()=>{
            toast.error("Product Can't Be Updated Due To Some Error")
            setTimeout(()=>{navigate('/');},2000);
        },

    });


    const {mutateAsync:addProductMutation} = useMutation({
        mutationFn:addProduct,
        onSuccess: ()=>{
            toast.success("Product Added Successfully");
            queryClient.invalidateQueries({queryKey:["products"]})
            setTimeout(()=>{
                navigate('/');
            },1000);
        },
        onError: ()=>{
            toast.error("Something Went Wrong");
            setTimeout(()=>{navigate('/')},1000);
        }
    });


    const {mutateAsync:deleteProductMutation} = useMutation({
        mutationFn:deleteProduct,
        onSuccess: ()=>{
            toast.success("Product Deleted Successfully");
            queryClient.invalidateQueries({queryKey:["products"]})
            setTimeout(()=>{
                navigate('/');
            },1000);
        },
        onError: ()=>{
            toast.error("Something Went Wrong");
            setTimeout(()=>{navigate('/')},1000);
        }
    });

    const productContextValue = {
        products,
        updateProductMutation,
        addProductMutation,
        deleteProductMutation,
        isLoading,
        isError,
        error
    }

    return(
        <ProductContext.Provider value={productContextValue}>
            {children}
        </ProductContext.Provider>
    )


}

//custom hook for context
export const useProductContext = () =>{
    const context = useContext(ProductContext);
    if(!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
}