import {createContext, useContext, useEffect, useMemo, useState} from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

const CartContext = createContext();

export  const cartProvider = ({children}) =>{
    const [cart,setCart] = useLocalStorage("cart",[]);
    const [customerDetails,setCustomerDetails] = useState({
        customerName:"",
        email:""
    })



    const addProductToCart = ({productId,quantity})=>{
        let flag = false;
        let localCart = [...cart];
        for(let i = 0; i<cart.length ; i++){
            if(localCart[i].productId===productId){
                let q = localCart[i].quantity;
                localCart[i] = {
                    productId:productId,
                    quantity:q+1
                }
                flag=true;
                break;
            }
        }
        if(!flag){
            localCart.push({
                productId:productId,
                quantity:quantity
            })
        }
        setCart(localCart);
    }

    useEffect(()=>{
        localStorage.setItem("cart",JSON.stringify(cart));
    },[cart])



    const contextValues = {
        cart,
        addProductToCart
    }


    return (
        <CartContext.Provider value={contextValues}>
            {children}
        </CartContext.Provider>
    )

}

export const useCartContext = ()=>{
    const context = useContext(CartContext);
    if(!context){
        throw new Error("useProductContext must be used within a ProductProvider")
    }
    return context;
}