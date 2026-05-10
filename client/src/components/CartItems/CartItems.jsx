import './CartItems.css';
import {AppContext} from "../../context/AppContext.jsx";
import {useContext} from "react";

const CartItems = () => {
    const {cartItems , removeFromCart , updateCartItemQuantity} = useContext(AppContext);
    
    return(
        <div className="cart-items-wrapper">
            {cartItems.length === 0 ? (
                <div className="empty-cart-message">
                    <i className="bi bi-cart-x fs-1 opacity-25 mb-2"></i>
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                <div className="cart-items-list-modern">
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item-modern">
                            <img src={item.imgUrl} alt={item.name} className="cart-item-thumb" />
                            
                            <div className="cart-item-info">
                                <div className="cart-item-header">
                                    <h6 className="cart-item-name">{item.name}</h6>
                                    <button 
                                        className="cart-item-remove"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                </div>
                                
                                <div className="cart-item-controls">
                                    <div className="qty-picker">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity === 1}
                                        >
                                            <i className="bi bi-dash"></i>
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button 
                                            className="qty-btn"
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                        >
                                            <i className="bi bi-plus"></i>
                                        </button>
                                    </div>
                                    <div className="cart-item-price">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default CartItems;