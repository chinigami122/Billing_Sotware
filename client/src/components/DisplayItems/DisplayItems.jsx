import {useContext, useState} from 'react';
import { AppContext } from '../../context/AppContext';
import Item from '../Item/Item';
import './DisplayItems.css';
import SearchBox from "../SearchBox/SearchBox.jsx";

const DisplayItems = ({selectedCategory}) => {
    const { itemsData } = useContext(AppContext);
    const [searcheText , setSearchText] = useState("");
    const filteredItems = itemsData.filter(item => {
        if(!selectedCategory) return true;
        return String(item.categoryId) === String(selectedCategory);
    }).filter(item => item.name.toLowerCase().includes(searcheText.toLowerCase()));

    return (
        <div className="display-items-container">
            <div className="search-bar-wrapper">
                <SearchBox onSearch={setSearchText} />
            </div>
            
            <div className="product-grid">
                {filteredItems.map((item, index) => (
                    <Item
                        key={index}
                        itemName={item.name}
                        itemPrice={item.price}
                        itemImage={item.imgUrl}
                        itemId={item.itemId}
                        stock={item.stock || 0}
                    />
                ))}
            </div>
            {filteredItems.length === 0 && (
                <div className="no-items-message">
                    <i className="bi bi-search mb-3 fs-1 opacity-25"></i>
                    <p>No products found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default DisplayItems;