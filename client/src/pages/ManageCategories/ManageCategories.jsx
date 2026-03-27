import "./ManageCategories.css"
import CategoryForm from "../../components/Categoryform/CategoryForm.jsx";
import CategoryList from "../../components/CategoryList/CategoryList.jsx";
const ManageCategory = () => {
    return (
        <div className="category-container text-light">
            <div className="left-column">
                <CategoryForm />
            </div>

            <div className="right-column">
                <CategoryList />
            </div>
        </div>
    );
};

export default ManageCategory;
