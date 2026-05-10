import './Item.css';
import {AppContext} from "../../context/AppContext.jsx";
import {useContext} from "react";

const Item = ({itemName , itemPrice , itemImage , itemId, stock}) => {
    const {addToCart} = useContext(AppContext);
    const handleAddToCart = () => {
        addToCart({id: itemId, name: itemName, price: itemPrice , quantity: 1, imgUrl: itemImage});
    }
    return (
        <div className="glass-card item-card-modern">
            <div className="stock-badge">{stock} in stock</div>
            
            <div className="item-image-wrapper">
                <img
                    src={itemImage}
                    alt={itemName}
                    className="item-image-styled"
                />
            </div>

            <div className="item-details">
                <h6 className="item-name-text">{itemName}</h6>
                <div className="item-footer">
                    <span className="item-price-accent">${itemPrice}</span>
                </div>
            </div>

            <button className="add-to-cart-overlay" onClick={handleAddToCart}>
                <i className="bi bi-cart-plus me-2"></i>
                Add to Cart
            </button>
        </div>
    )
}

export default Item;