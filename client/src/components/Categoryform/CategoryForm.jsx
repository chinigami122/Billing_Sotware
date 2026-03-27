import {useContext, useEffect, useState} from "react";
import {assets} from "../../assets/assets.js";
import toast from "react-hot-toast";
import {addCategory} from "../../service/categoryService.js";
import {AppContext} from "../../context/AppContext.jsx";

const getInitialCategoryData = () => ({
    name: "",
    description: "",
    bgColor: "#2c2c2c"
});

const CategoryForm = () => {
    const {setCategories} = useContext(AppContext);
    const [loading , setLoading] = useState(false);
    const [image , setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(assets.upload);
    const [data , setData] = useState(getInitialCategoryData);

    useEffect(() => {
        if (!image) {
            setPreviewUrl(assets.upload);
            return;
        }

        const objectUrl = URL.createObjectURL(image);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    const onChangeHandler = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setData((data) => ({
            ...data,
            [name]: value
        }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(!image){
            toast.error("Select image for category");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("category" , JSON.stringify(data));
        formData.append("file" , image);
        try {
            const response = await addCategory(formData);
            if(response.status === 201){
                setCategories((prev) => [...prev, response.data]);
                toast.success("Category add");
                setData(getInitialCategoryData());
                setImage(null);
            }
        }catch (err){
            console.error(err)
            toast.error("Error adding category")
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-12 form-container">
                    <div className="card-body">
                        <form onSubmit={onSubmitHandler}>

                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">
                                    <img
                                        src={previewUrl}
                                        alt="preview"
                                        width="48"
                                        height="48"
                                    />
                                </label>

                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    className="form-control"
                                    hidden onChange={(e) => setImage(e.target.files[0])}
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
                                    placeholder="Category Name"
                                    onChange={onChangeHandler}
                                    value={data.name}
                                />
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
                                <div className="mb-3">
                                    <label htmlFor="bgcolor" className="form-label">
                                        Background color
                                    </label>
                                    <br />

                                    <input
                                        type="color"
                                        name="bgColor"
                                        id="bgcolor"
                                        className="form-control form-control-color"
                                        title="Choose background color"
                                        onChange={onChangeHandler}
                                        value={data.bgColor}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-warning w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Loading" : "Submit"}
                                </button>


                            </div>


                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;
