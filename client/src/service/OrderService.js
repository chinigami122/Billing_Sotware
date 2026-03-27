import axios from "axios";

// 1. BASE URL Configuration
const API_BASE_URL = "http://localhost:8080/api/v1.0";

// Helper function to get the token from localStorage
// (Assuming you saved it as 'token' during login)
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

export const latestOrders = async () => {
    return await axios.get(`${API_BASE_URL}/orders/latest`, getAuthHeaders());
};

export const createOrder = async (order) => {
    // This is the call that will return your Stripe checkoutUrl!
    return await axios.post(`${API_BASE_URL}/payments/create`, order, getAuthHeaders());
};

export const deleteOrder = async (id) => {
    return await axios.delete(`${API_BASE_URL}/orders/${id}`, getAuthHeaders());
};

