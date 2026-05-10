import { useContext } from 'react';
import { AppContext } from "../../context/AppContext.jsx";
import './CustomerFrom.css';

const CustomerFrom = () => {
    const {
        customerName,
        setCustomerName,
        mobileNumber,
        setMobileNumber
    } = useContext(AppContext);

    return (
        <div className="customer-form-card-modern">
            <div className="input-group-custom mb-3">
                <i className="bi bi-person input-icon-custom"></i>
                <input
                    type="text"
                    className="input-custom-field"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
            </div>

            <div className="input-group-custom">
                <i className="bi bi-phone input-icon-custom"></i>
                <input
                    type="tel"
                    className="input-custom-field"
                    placeholder="Phone Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    inputMode="tel"
                />
            </div>
        </div>
    );
};

export default CustomerFrom;