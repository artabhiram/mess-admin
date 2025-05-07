import { createContext, useEffect, useState } from "react";
//import { food_list, menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "https://mess-backend-p42j.onrender.com"
    const [food_list, setFoodList] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"))
    const currency = "₹";
    const deliveryCharge = 5;
    const [mess, setMess] = useState("");


    // const addToCart = async (itemId) => {
    //     if (!cartItems[itemId]) {
    //         setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    //     }
    //     else {
    //         setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    //     }
    //     if (token) {
    //         await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    //     }
    // }

    // const removeFromCart = async (itemId) => {
    //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    //     if (token) {
    //         await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    //     }
    // }

    // const getTotalCartAmount = () => {
    //     let totalAmount = 0;
    //     for (const item in cartItems) {
    //         try {
    //           if (cartItems[item] > 0) {
    //             let itemInfo = food_list.find((product) => product._id === item);
    //             totalAmount += itemInfo.price * cartItems[item];
    //         }  
    //         } catch (error) {
                
    //         }
            
    //     }
    //     return totalAmount;
    // }

    // const fetchFoodList = async () => {
    //     const response = await axios.get(url + "/api/food/list");
    //     setFoodList(response.data.data)
    // }

    // const loadCartData = async (token) => {
    //     const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
    //     setCartItems(response.data.cartData);
    // }

    // useEffect(() => {

    //         if (localStorage.getItem("token")) {
    //             setToken(localStorage.getItem("token"))
    //         }
    // }, [])

    const contextValue = {
        url,
        food_list,
        setFoodList,
        // menu_list,
        
        // addToCart,
        // removeFromCart,
        // getTotalCartAmount,
        token,
        setToken,
        // loadCartData,
        
        currency,
        deliveryCharge,
        mess,
        setMess,
        
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;
