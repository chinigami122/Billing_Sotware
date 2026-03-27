import { useContext } from 'react';
import { AppContext } from "../../context/AppContext.jsx";
import './CustomerFrom.css';

const CustomerFrom = () => {
    // 1. Pull the state and setters directly from our AppContext
    const {
        customerName,
        setCustomerName,
        mobileNumber,
        setMobileNumber
    } = useContext(AppContext);

    return (
        <div className="customer-form-card">
            {/* Name Input */}
            <div className="customer-input-wrapper mb-2">
                <i className="bi bi-person-fill customer-input-icon"></i>
                <input
                    type="text"
                    className="customer-input"
                    placeholder="Customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
            </div>

            {/* Phone Input */}
            <div className="customer-input-wrapper">
                <i className="bi bi-telephone-fill customer-input-icon"></i>
                <input
                    type="tel"
                    className="customer-input"
                    placeholder="Phone number"
                    value={mobileNumber} // Changed from customerPhone to match context
                    onChange={(e) => setMobileNumber(e.target.value)} // Changed from setCustomerPhone
                    inputMode="tel"
                />
            </div>
        </div>
    );
};

export default CustomerFrom;