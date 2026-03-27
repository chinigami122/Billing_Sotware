import { useContext } from 'react';
import './CartItem.css';
import { AppContext } from '../../context/AppContext.jsx';

const CartItem = ({ item, quantity }) => {
    const { addItem, addToCart, removeFromCart, updateCartItemQuantity } = useContext(AppContext);

    const handleIncrement = () => {
        // Prefer addItem if provided, otherwise fall back to addToCart
        if (typeof addItem === 'function') {
            addItem(item.id);
        } else if (typeof addToCart === 'function') {
            addToCart(item);
        }
    };

    const handleDecrement = () => {
        if (typeof removeFromCart === 'function') {
            removeFromCart(item.id);
        }
    };

    const handleDelete = () => {
        if (typeof updateCartItemQuantity === 'function') {
            updateCartItemQuantity(item.id, 0);
        }
    };

    const priceDisplay = item.price ? `$${Number(item.price).toFixed(2)}` : '$0.00';

    return (
        <div className="cart-item-card">
            <div className="cart-item-main">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">{priceDisplay}</div>
            </div>

            <div className="cart-item-actions">
                <div className="qty-control">
                    <button className="qty-btn qty-btn-red" onClick={handleDecrement} aria-label="Decrease quantity">-</button>
                    <span className="qty-value">{quantity}</span>
                    <button className="qty-btn qty-btn-blue" onClick={handleIncrement} aria-label="Increase quantity">+</button>
                </div>

                <button className="delete-btn" onClick={handleDelete} aria-label="Remove item">
                    <i className="bi bi-trash"></i>
                </button>
            </div>
        </div>
    );
};

export default CartItem;
