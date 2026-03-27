import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { addItem } from "../../service/ItemService.js";
import { AppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets.js";

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

        // 1. Validate BEFORE doing anything else!
        if (!image) {
            toast.error("Select image");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        // 2. Added JSON.stringify() here!
        formData.append("item", JSON.stringify(data)); 
        formData.append("file", image);

        try {
            const response = await addItem(formData);

            if (response.status === 201) {
                setItemsData([...itemsData, response.data]);
                setCategories((prevCategories) => 
                prevCategories.map((category) => category.categoryId === data.categoryId ? {...category , itams : category.items + 1} : category));
                toast.success("Item added");
                
                // 3. Reset the form cleanly
                setData(getInitialItemData()); 
                setImage(null); // <-- Added this so the image preview clears!
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
        <div className="item-form-container" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <div className="mx-2 mt-2">
                <div className="row">
                    <div className="card col-md-8 form-container">
                        <div className="card-body">
                            <form onSubmit={onSubmitHandler}>

                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">
                                        <img src={image ? URL.createObjectURL(image) : assets.upload} alt="" width={48} />
                                    </label>

                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        className="form-control"
                                        hidden
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control"
                                        placeholder="Item Name"
                                        onChange={onChangeHandler}
                                        value={data.name}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="category">
                                        Category
                                    </label>

                                    <select
                                        name="categoryId"
                                        id="category"
                                        className="form-control"
                                        onChange={onChangeHandler}
                                        value={data.categoryId}
                                    >
                                        <option value="">-- SELECT CATEGORY --</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category.categoryId}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        className="form-control"
                                        placeholder="$200"
                                        onChange={onChangeHandler}
                                        value={data.price}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        rows="5"
                                        name="description"
                                        id="description"
                                        className="form-control"
                                        placeholder="Write content here ..."
                                        onChange={onChangeHandler}
                                        value={data.description}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-warning w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Loading" : "Save"}
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemsForm;
