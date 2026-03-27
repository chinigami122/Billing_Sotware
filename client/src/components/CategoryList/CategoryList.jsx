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
        return itemsData.filter(item => item.categoryId === catId).length;
    };

    const deleteByCategory = async (categoryId) => {
        try{
            const response = await deleteCategory(categoryId);
            if (response.status === 204){
                const updatedCategories = categories.filter(category => category.categoryId ==! categoryId);
                setCategories(updatedCategories);
                toast.success("Category deleted")
            }else{
                toast.error("Enable to delete category")
            }
        }catch (error) {
            console.log(error);
            toast.error("Enable to delete category")
        }
    }

    return(
        <div className="category-list-container" style={{height:'100vh' , overflowY:'auto' , overflowX:'hidden'}}>
            <div className="row pe-2">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        name="keyword"
                        id="keyword"
                        placeholder="Search by keyword"
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
                {filteredCategories.map((category, index) => (
                    <div key={index} className="col-12">
                        <div
                            className="card p-3"
                            style={{ backgroundColor: category.bgColor }}
                        >
                            <div className="d-flex align-items-center">
                                <div className="category-img-container">
                                    <img
                                        src={category.imgUrl}
                                        alt={category.name}
                                        className="category-img"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>

                                <div className="flex-grow-1 ms-3">
                                    <h5 className="mb-1 text-white">
                                        {category.name}
                                    </h5>
                                    <p className="mb-0 text-white">
                                        {countItemsByCategory(category.categoryId)} Items
                                    </p>
                                </div>

                                <div>
                                    <button className="btn btn-danger btn-sm"
                                            onClick={() => deleteByCategory(category.categoryId)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}
export default CategoryList;