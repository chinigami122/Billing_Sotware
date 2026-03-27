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
        try {
            const response = await deleteItem(itemId);
            if (response.status === 204) {
                // Filter out the deleted item
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
        <div className="items-list-container" style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}>
            <div className="row pe-2">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        name="keyword"
                        id="keyword"
                        placeholder="Search items"
                        className="form-control"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    <span className="input-group-text bg-warning">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
            </div>

            <div className="row g-3 pe-2">
                {filteredItems.map((item) => (
                    <div key={item.itemId} className="col-12">
                        <div className="card item-card p-3 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <div className="item-img-container">
                                        <img
                                            src={item.imgUrl}
                                            alt={item.name}
                                            className="item-img"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <div className="ms-3 d-flex flex-column">
                                        <span className="text-white fw-bold">{item.name}</span>
                                        <span className="text-secondary small mb-1">
                                            Category: {getCategoryName(item.categoryId)}
                                        </span>
                                        <span className="badge bg-warning text-dark align-self-start rounded-pill px-3">
                                        ${item.price}
                                        </span>
                                    </div>  
                                </div>

                                <button
                                    className="btn btn-danger btn-sm rounded-2"
                                    style={{ width: '38px', height: '38px' }}
                                    onClick={() => handleDelete(item.itemId)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ItemsList;