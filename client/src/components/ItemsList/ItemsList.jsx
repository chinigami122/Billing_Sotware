import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext.jsx";
import { deleteItem } from "../../service/ItemService.js";
import "./ItemsList.css";

const ItemsList = () => {
    const { itemsData, setItemsData, categories } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredItems = itemsData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCategoryName = (id) => {
        const cat = categories.find((c) => c.categoryId === id);
        return cat ? cat.name : "Unknown";
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        
        try {
            const response = await deleteItem(itemId);
            if (response.status === 204) {
                const updatedItems = itemsData.filter((item) => item.itemId !== itemId);
                setItemsData(updatedItems);
                toast.success("Item deleted");
            } else {
                toast.error("Unable to delete item");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete item");
        }
    };

    return (
        <div className="items-list-container-modern">
            <div className="search-header-modern mb-4">
                <div className="input-group-custom">
                    <i className="bi bi-search input-icon-custom"></i>
                    <input
                        type="text"
                        placeholder="Search items..."
                        className="input-custom-field"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                </div>
            </div>

            <div className="items-scroll-area">
                {filteredItems.map((item) => (
                    <div key={item.itemId} className="glass-card item-horizontal-card mb-3">
                        <div className="item-img-wrapper-mini">
                            <img
                                src={item.imgUrl}
                                alt={item.name}
                                className="item-img-mini"
                            />
                        </div>
                        
                        <div className="item-info-extended">
                            <div className="item-main-details">
                                <h6 className="item-title">{item.name}</h6>
                                <span className="item-category-pill">{getCategoryName(item.categoryId)}</span>
                            </div>
                            
                            <div className="item-price-tag">
                                ${item.price}
                            </div>
                        </div>

                        <div className="item-actions-panel">
                            <button className="btn-action edit" title="Edit">
                                <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                                className="btn-action delete" 
                                title="Delete"
                                onClick={() => handleDelete(item.itemId)}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
                
                {filteredItems.length === 0 && (
                    <div className="text-center py-5 opacity-50">
                        <i className="bi bi-box-seam fs-1 mb-2"></i>
                        <p>No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ItemsList;