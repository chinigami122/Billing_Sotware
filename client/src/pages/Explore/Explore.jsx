import './Explore.css'
import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import DisplayCategory from "../../components/DisplayCategory/DisplayCategory.jsx";
import DisplayItems from "../../components/DisplayItems/DisplayItems.jsx";
import CustomerFrom from "../../components/CustomerForm/CustomerFrom.jsx";
import CartItems from "../../components/CartItems/CartItems.jsx";
import CartSummary from "../../components/CartSummary/CartSummary.jsx";

const Explore = () => {
    const {categories, cartItems} = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="explore-container page-container">
            {/* LEFT SIDE: Categories & Products */}
            <div className="left-column">
                <div className="first-row">
                    <DisplayCategory
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={categories} />
                </div>

                <div className="second-row">
                    <DisplayItems selectedCategory={selectedCategory}/>
                </div>
            </div>

            {/* RIGHT SIDE: Cart Panel (Drawer on Mobile) */}
            <div className={`right-column ${isCartOpen ? 'show' : ''}`}>
                <div className="glass-card order-summary-panel">
                    <div className="drawer-handle d-lg-none" onClick={() => setIsCartOpen(false)}></div>
                    
                    <div className="panel-header">
                        <i className="bi bi-cart3 fs-4"></i>
                        <h5>Order Summary</h5>
                        <span className="cart-count-badge">{cartCount} items</span>
                        <button 
                            className="btn-close btn-close-white ms-auto d-lg-none" 
                            onClick={() => setIsCartOpen(false)}
                        ></button>
                    </div>

                    <div className="customer-form-container">
                        <CustomerFrom />
                    </div>

                    <div className="cart-items-container">
                        <CartItems />
                    </div>

                    <div className="cart-summary-container">
                        <CartSummary />
                    </div>
                </div>
            </div>

            {/* FLOATING CART BUTTON (Mobile only) */}
            <button className="floating-cart-btn" onClick={() => setIsCartOpen(true)}>
                <i className="bi bi-cart-fill fs-4"></i>
                {cartCount > 0 && (
                    <span className="floating-cart-badge">{cartCount}</span>
                )}
            </button>
        </div>
    );
};

export default Explore;
