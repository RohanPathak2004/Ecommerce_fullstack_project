import React from 'react'
import {useCartContext} from "../context/CartContext.jsx";
import CartColumn from "../components/CartColumn.jsx";

const Cart = () => {

    const {cart} = useCartContext();
    console.log(cart[0].productId);
    return (
        <div>
            <div>
                <h1>Shopping Cart</h1>
                <div>
                    {
                        cart.map((item,idx)=>{
                            const id = item.productId;
                            const quantity = item.quantity;
                            console.log(id)
                            return (
                                <CartColumn id={id} quantity={quantity}/>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
export default Cart
