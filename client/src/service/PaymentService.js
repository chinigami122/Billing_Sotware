import axios from "axios";

// 1. Centralized Base URL
const API_BASE_URL = "http://localhost:8080/api/v1.0";

// Helper to grab the token and set the Bearer header
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

/**
 * Sends the full order to the backend to get the Stripe Checkout URL.
 * We renamed this from 'createRazorpayOrder' to be more accurate!
 */
export const createStripePayment = async (orderData) => {
    // This hits your new consolidated @PostMapping("/create") in PaymentController
    return await axios.post(`${API_BASE_URL}/payments/create`, orderData, getAuthHeaders());
};

/**
 * Tells the backend to verify the Stripe Session ID.
 * This should be called when the user lands on your 'Success' page.
 */
export const verifyPayment = async (sessionId) => {
    // Note: We use a query parameter (?sessionId=...) as defined in your Spring Boot @RequestParam
    return await axios.post(
        `${API_BASE_URL}/payments/verify?sessionId=${sessionId}`,
        {}, // Empty body
        getAuthHeaders()
    );
};

/**
 * Fetches the PDF receipt from the backend as a Blob.
 */
export const downloadOrderReceipt = async (orderId) => {
    const token = localStorage.getItem("token");

    // We use axios.get but we MUST specify responseType: 'blob'
    return await axios.get(`${API_BASE_URL}/payments/receipt/${orderId}`, {
        responseType: 'blob',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};