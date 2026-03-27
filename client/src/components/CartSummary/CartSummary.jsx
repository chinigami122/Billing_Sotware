import { useState, useContext } from 'react'; // Added missing useState
import './CartSummary.css';
import { AppContext } from "../../context/AppContext.jsx";
import { createStripePayment } from "../../service/PaymentService.js"; // Import our new service
import toast from "react-hot-toast";

const CartSummary = () => {
    // 1. Grab everything we need from Context
    const { cartItems, customerName, mobileNumber } = useContext(AppContext);
    const [isProcessing, setIsProcessing] = useState(false);

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = totalAmount * 0.1;
    const grandTotal = totalAmount + tax;

    /**
     * The Master Payment Function
     */
    const handlePayment = async (mode) => {
        // Basic Validations
        if (!customerName || !mobileNumber) {
            toast.error("Please enter customer details (Name & Phone)");
            return;
        }
        if (cartItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        setIsProcessing(true);

        // Match the JSON structure your Spring Boot backend expects
        const orderData = {
            customerName,
            phoneNumber: mobileNumber,
            cartItems: cartItems.map(item => ({
                itemId: item.itemId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            subtotal: totalAmount,
            tax,
            grandTotal,
            paymentMethod: mode // Will be "CASH", "UPI", or "CARD"
        };

        try {
            const response = await createStripePayment(orderData);
            const { checkoutUrl, paymentMethod } = response.data;

            if (paymentMethod === "CASH") {
                toast.success("Order placed successfully (Cash on Delivery)!");
                // Optionally: Redirect to a success page or clear cart
            } else if (checkoutUrl) {
                // THE MAGIC LINE: Send the user to Stripe's secure payment page
                toast.loading("Redirecting to secure payment...");
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error("Order Creation Error:", error);
            toast.error("Failed to process order. Check your backend console.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="cart-summary-content mt-2">
            <div className="cart-summary-details">
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Subtotal:</span>
                    <span className="text-light">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Tax (10%):</span>
                    <span className="text-light">${tax.toFixed(2)}</span>
                </div>
                <hr className="text-secondary" />
                <div className="d-flex justify-content-between mb-4">
                    <span className="text-light h5">Total:</span>
                    <span className="text-light h5">${grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="d-flex gap-3 cart-summary-actions mb-3">
                <button
                    disabled={isProcessing}
                    onClick={() => handlePayment("CASH")}
                    className="btn btn-outline-success flex-grow-1">
                    {isProcessing ? "..." : "Cash"}
                </button>

                <button
                    disabled={isProcessing}
                    onClick={() => handlePayment("UPI")}
                    className="btn btn-primary flex-grow-1">
                    {isProcessing ? "Processing..." : "Pay Online"}
                </button>
            </div>
        </div>
    );
};

export default CartSummary;