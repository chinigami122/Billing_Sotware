import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import "./CategoryList.css";
import {deleteCategory} from "../../service/categoryService.js";
import toast from "react-hot-toast";

const CategoryList = () =>{
    const {categories , setCategories, itemsData} = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const countItemsByCategory = (catId) => {
        return itemsData.filter(item => String(item.categoryId) === String(catId)).length;
    };

    const deleteByCategory = async (categoryId) => {
        if (!window.confirm("Are you sure? This will delete the category.")) return;
        
        try{
            const response = await deleteCategory(categoryId);
            if (response.status === 204){
                setCategories(prev => prev.filter(cat => String(cat.categoryId) !== String(categoryId)));
                toast.success("Category deleted");
            } else {
                toast.error("Unable to delete category");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete category");
        }
    }

    return(
        <div className="category-list-container-modern">
            <div className="search-header-modern mb-4">
                <div className="input-group-custom">
                    <i className="bi bi-search input-icon-custom"></i>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="input-custom-field"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                </div>
            </div>

            <div className="categories-scroll-area">
                {filteredCategories.map((category, index) => (
                    <div key={index} className="glass-card category-horizontal-card mb-3">
                        <div className="cat-icon-box" style={{ background: `${category.bgColor}20` }}>
                            <img
                                src={category.imgUrl}
                                alt={category.name}
                                className="cat-icon-img"
                            />
                        </div>
                        
                        <div className="cat-info-extended">
                            <div className="cat-main-details">
                                <h6 className="cat-title">{category.name}</h6>
                                <span className="cat-item-count">{countItemsByCategory(category.categoryId)} Products</span>
                            </div>
                        </div>

                        <div className="cat-actions-panel">
                            <button 
                                className="btn-action delete" 
                                title="Delete"
                                onClick={() => deleteByCategory(category.categoryId)}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
                
                {filteredCategories.length === 0 && (
                    <div className="text-center py-5 opacity-50">
                        <i className="bi bi-tags fs-1 mb-2"></i>
                        <p>No categories found</p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default CategoryList;