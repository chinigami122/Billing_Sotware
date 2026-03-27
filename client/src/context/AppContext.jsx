import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../service/categoryService.js";
import { fetchItems } from "../service/ItemService.js";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {

    const [categories, setCategories] = useState([]);
    const [itemsData , setItemsData] = useState([]);
    const [auth , setAuth] = useState({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role")
    });
    const [cartItems , setCartItems] = useState([]);

    // 🚨 ADD THESE TWO NEW STATES
    const [customerName, setCustomerName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");

    const addToCart = (item) => {
        // ... (Keep your existing logic)
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCartItems(prev =>
                prev.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            );
        } else {
            setCartItems(prev => [...prev, { ...item, quantity: 1 }]);
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter(cartItem => cartItem.id !== itemId));
    }

    const updateCartItemQuantity = (itemId, newQuantity) => {
        setCartItems(prev =>
            prev.map(cartItem =>
                cartItem.id === itemId
                    ? { ...cartItem, quantity: newQuantity }
                    : cartItem
            )
        );
    }

    useEffect(() => {
        async function loadData() {
            if (localStorage.getItem("token") && localStorage.getItem("role")) {
                setAuthData(
                    localStorage.getItem("token"),
                    localStorage.getItem("role")
                );
            }
            try {
                const response = await fetchCategories();
                setCategories(response.data);
                const itemResponse = await fetchItems();
                setItemsData(itemResponse.data);
            } catch (error) {
                console.error("Unable to fetch data", error);
            }
        }
        loadData();
    }, []);

    const setAuthData = (token , role) => {
        setAuth({token, role});
    }

    const contextValue = {
        categories,
        setCategories,
        auth,
        setAuth,
        setAuthData,
        itemsData,
        setItemsData,
        addToCart,
        cartItems,
        setCartItems,
        removeFromCart,
        updateCartItemQuantity,
        // 🚨 ADD THESE TO THE CONTEXT VALUE
        customerName,
        setCustomerName,
        mobileNumber,
        setMobileNumber
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};