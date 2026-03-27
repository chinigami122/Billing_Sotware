import './CartItems.css';
import {AppContext} from "../../context/AppContext.jsx";
import {useContext} from "react";
const CartItems = () => {
    const {cartItems , removeFromCart , updateCartItemQuantity} = useContext(AppContext);
    return(
        <div className="p-3 h-100 overflow-y-auto">
            {cartItems.length === 0 ? (
                <p className="text-light">
                    Your cart is empty.
                </p>
            ) : (
                <div className="cart-items-list">
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item mb-3 p-3 bg-dark rounded">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 text-light">{item.name}</h6>
                                <p className="mb-0 text-light">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity === 1}
                                    >
                                        <i className="bi bi-dash"></i>
                                    </button>
                                    <span className="text-light">{item.quantity}</span>
                                    <button className="btn btn-primary btn-sm"
                                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                    >
                                        <i className="bi bi-plus"></i>
                                    </button>
                                </div>
                                <button className="btn btn-danger btn-sm" style={{ width: "auto" }}
                                onClick={() => removeFromCart(item.id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default CartItems;