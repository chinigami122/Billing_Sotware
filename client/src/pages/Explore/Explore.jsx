import './Explore.css'
import {useContext} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import DisplayCategory from "../../components/DisplayCategory/DisplayCategory.jsx";
import DisplayItems from "../../components/DisplayItems/DisplayItems.jsx";
import CustomerFrom from "../../components/CustomerForm/CustomerFrom.jsx";
import CartItems from "../../components/CartItems/CartItems.jsx";
import CartSummary from "../../components/CartSummary/CartSummary.jsx";
import {useState} from "react";
const Explore = () => {
    const {categories} = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [customerName , setCustomerName] = useState("");
    const [customerPhone , setCustomerPhone] = useState("");
    return (
        <div className="explore-container text-light">

            {/* LEFT SIDE */}
            <div className="left-column">

                <div className="first-row">
                    <DisplayCategory
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={categories} />
                </div>

                <hr className="horizontal-line" />

                <div className="second-row">
                    <DisplayItems selectedCategory={selectedCategory}/>
                </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="right-column">

                <div className="customer-form-container">
                    <CustomerFrom
                    customerName={customerName}
                    setCustomerName={setCustomerName}
                    customerPhone={customerPhone}
                    setCustomerPhone={setCustomerPhone}
                    />
                </div>

                <hr className="right-divider" />

                <div className="cart-items-container">
                    <CartItems />
                </div>

                <div className="cart-summary-container">
                    <CartSummary
                        customerName={customerName}
                        setCustomerName={setCustomerName}
                        customerPhone={customerPhone}
                        setCustomerPhone={setCustomerPhone}
                    />
                </div>

            </div>

        </div>
    );
};

export default Explore;
