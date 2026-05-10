import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { addItem } from "../../service/ItemService.js";
import { AppContext } from "../../context/AppContext.jsx";
import './ItemsForm.css';

const getInitialItemData = () => ({
    name: "",
    categoryId: "",
    price: "",
    description: ""
});

const ItemsForm = () => {
    const { categories , setItemsData , itemsData , setCategories} = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [data, setData] = useState(getInitialItemData);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!image) {
            toast.error("Please upload an image");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("item", JSON.stringify(data)); 
        formData.append("file", image);

        try {
            const response = await addItem(formData);

            if (response.status === 201) {
                setItemsData([...itemsData, response.data]);
                setCategories((prevCategories) => 
                prevCategories.map((category) => category.categoryId === data.categoryId ? {...category , items : category.items + 1} : category));
                toast.success("Item added successfully");
                setData(getInitialItemData()); 
                setImage(null);
            } else {
                toast.error("Unable to add item");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to add item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-4 form-card-modern">
            <h5 className="mb-4 fw-bold">Add New Product</h5>
            <form onSubmit={onSubmitHandler}>
                <div className="upload-container-modern mb-4">
                    <label htmlFor="image" className="upload-label-styled">
                        {image ? (
                            <img src={URL.createObjectURL(image)} alt="Preview" className="upload-preview" />
                        ) : (
                            <div className="upload-placeholder">
                                <i className="bi bi-cloud-arrow-up fs-1 mb-2"></i>
                                <span>Click to upload image</span>
                                <small className="text-secondary opacity-50 mt-1">Drag & drop supported</small>
                            </div>
                        )}
                    </label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <div className="form-group-modern mb-3">
                    <label className="label-modern">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        className="input-custom"
                        placeholder="e.g. Wireless Headphones"
                        style={{width: '100%'}}
                        onChange={onChangeHandler}
                        value={data.name}
                        required
                    />
                </div>

                <div className="form-group-modern mb-3">
                    <label className="label-modern">Category</label>
                    <select
                        name="categoryId"
                        className="input-custom"
                        style={{width: '100%'}}
                        onChange={onChangeHandler}
                        value={data.categoryId}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group-modern mb-3">
                    <label className="label-modern">Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        className="input-custom"
                        placeholder="0.00"
                        style={{width: '100%'}}
                        onChange={onChangeHandler}
                        value={data.price}
                        required
                    />
                </div>

                <div className="form-group-modern mb-4">
                    <label className="label-modern">Description</label>
                    <textarea
                        rows="3"
                        name="description"
                        className="input-custom"
                        placeholder="Product details..."
                        style={{width: '100%'}}
                        onChange={onChangeHandler}
                        value={data.description}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="btn-custom w-100 py-3 mt-2"
                    disabled={loading}
                    style={{background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', color: 'white'}}
                >
                    <i className="bi bi-save me-2"></i>
                    {loading ? "Processing..." : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default ItemsForm;
