import './App.css'
import {Route, Routes} from "react-router";
import NavigationBar from "./components/NavigationBar.jsx";
import Home from "./pages/Home.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import Orders from "./pages/Orders.jsx";
import Cart from "./pages/Cart.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Product from "./pages/Product.jsx";
import UpdateProduct from "./pages/UpdateProduct.jsx";
import {useEffect, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {Provider} from "react-redux";
import {ProductProvider} from "./context/ProductContext.jsx";
import {cartProvider} from "./context/CartContext.jsx";

const queryClient = new QueryClient();

function App() {

    const [addedToCart,setAddedToCart] = useState(0);
    const [updateNotification,setUpdateNotification] = useState(0);
    const addNotify = ()=>toast("Product Added To Cart")
    const updateNotify = ()=>toast("Updated Product");
    useEffect(()=>{
        if(addedToCart===0) return;
        console.log(addedToCart);
        addNotify();
    },[addedToCart])

    useEffect(() => {
        if(updateNotification===0) return;
        console.log(updateNotification)
        updateNotify();
    }, [updateNotification]);


    const ContextComposer = ({providers,children})=>{
        return providers.reduceRight((acc,Provider)=>{
            return <Provider>{acc}</Provider>
        },children);
    }

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ContextComposer providers={[ProductProvider,cartProvider]}>
                <NavigationBar/>
                <ToastContainer/>
                <Routes>
                    <Route path={'/'} element={<Home/>}/>
                    <Route path={'/product/:id'} element={<Product setAddedToCart={setAddedToCart}/>}/>
                    <Route path={'/add'} element={<AddProduct/>}/>
                    <Route path={'/orders'} element={<Orders/>}/>
                    <Route path={'/cart'} element={<Cart/>}/>
                    <Route path={'/product/update/:id'} element={<UpdateProduct setUpdateNotification={setUpdateNotification} />}/>
                </Routes>
                </ContextComposer>
            </QueryClientProvider>
        </>
    )

}

export default App
