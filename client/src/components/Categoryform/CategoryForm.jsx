import {useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {addCategory} from "../../service/categoryService.js";
import {AppContext} from "../../context/AppContext.jsx";
import './CategoryForm.css';

const getInitialCategoryData = () => ({
    name: "",
    description: "",
    bgColor: "#1a1d27"
});

const CategoryForm = () => {
    const {setCategories} = useContext(AppContext);
    const [loading , setLoading] = useState(false);
    const [image , setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [data , setData] = useState(getInitialCategoryData);

    useEffect(() => {
        if (!image) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(image);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if(!image){
            toast.error("Please select a category icon");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("category" , JSON.stringify(data));
        formData.append("file" , image);
        
        try {
            const response = await addCategory(formData);
            if(response.status === 201){
                setCategories((prev) => [...prev, response.data]);
                toast.success("Category added successfully");
                setData(getInitialCategoryData());
                setImage(null);
            }
        } catch (err){
            console.error(err);
            toast.error("Error adding category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-4 form-card-modern">
            <h5 className="mb-4 fw-bold">New Category</h5>
            <form onSubmit={onSubmitHandler}>
                <div className="upload-container-modern mb-4">
                    <label htmlFor="cat-image" className="upload-label-styled">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="upload-preview" />
                        ) : (
                            <div className="upload-placeholder">
                                <i className="bi bi-tag fs-1 mb-2"></i>
                                <span>Select Icon</span>
                            </div>
                        )}
                    </label>
                    <input
                        type="file"
                        name="image"
                        id="cat-image"
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <div className="form-group-modern mb-3">
                    <label className="label-modern">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        className="input-custom"
                        placeholder="e.g. Smartphones"
                        style={{width: '100%'}}
                        onChange={onChangeHandler}
                        value={data.name}
                        required
                    />
                </div>

                <div className="form-group-modern mb-3">
                    <label className="label-modern">Description</label>
                    <textarea
                        rows="3"
                        name="description"
                        className="input-custom"
                        placeholder="Category details..."
                        style={{width: '100%'}}
                        onChange={onChangeHandler}
                        value={data.description}
                    ></textarea>
                </div>

                <div className="form-group-modern mb-4">
                    <label className="label-modern">Accent Color</label>
                    <div className="color-picker-wrapper">
                        <input
                            type="color"
                            name="bgColor"
                            className="color-input-custom"
                            onChange={onChangeHandler}
                            value={data.bgColor}
                        />
                        <span className="color-value-text">{data.bgColor}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-custom w-100 py-3 mt-2"
                    disabled={loading}
                    style={{background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', color: 'white'}}
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    {loading ? "Adding..." : "Create Category"}
                </button>
            </form>
        </div>
    );
};

export default CategoryForm;
