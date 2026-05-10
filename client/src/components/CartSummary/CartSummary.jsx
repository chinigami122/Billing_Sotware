import { useState, useContext } from 'react';
import './CartSummary.css';
import { AppContext } from "../../context/AppContext.jsx";
import { createStripePayment } from "../../service/PaymentService.js";
import toast from "react-hot-toast";

const CartSummary = () => {
    const { cartItems, customerName, mobileNumber } = useContext(AppContext);
    const [isProcessing, setIsProcessing] = useState(false);

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = totalAmount * 0.1;
    const grandTotal = totalAmount + tax;

    const handlePayment = async (mode) => {
        if (!customerName || !mobileNumber) {
            toast.error("Please enter customer details (Name & Phone)");
            return;
        }
        if (cartItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        setIsProcessing(true);

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
            paymentMethod: mode
        };

        try {
            const response = await createStripePayment(orderData);
            const { checkoutUrl, paymentMethod } = response.data;

            if (paymentMethod === "CASH") {
                toast.success("Order placed successfully (Cash)!");
            } else if (checkoutUrl) {
                toast.loading("Redirecting to secure payment...");
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error("Order Creation Error:", error);
            toast.error("Failed to process order.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="cart-summary-modern">
            <div className="summary-rows">
                <div className="summary-row">
                    <span className="row-label">Subtotal</span>
                    <span className="row-value">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                    <span className="row-label">Tax (10%)</span>
                    <span className="row-value">${tax.toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                    <span className="total-label">Total Amount</span>
                    <span className="total-value">${grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="payment-actions">
                <button
                    disabled={isProcessing}
                    onClick={() => handlePayment("CASH")}
                    className="btn-payment btn-cash-outline"
                >
                    <span className="btn-icon">💵</span>
                    {isProcessing ? "Processing..." : "Cash Payment"}
                </button>

                <button
                    disabled={isProcessing}
                    onClick={() => handlePayment("UPI")}
                    className="btn-payment btn-pay-online"
                >
                    <span className="btn-icon">💳</span>
                    {isProcessing ? "Processing..." : "Pay Online"}
                </button>
            </div>
        </div>
    );
};

export default CartSummary;