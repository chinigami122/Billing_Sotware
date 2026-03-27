import axios from "axios";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return {};
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const addCategory = async (category) => {
    return await axios.post(
        "http://localhost:8080/api/v1.0/admin/categories",
        category,
        getAuthConfig()
    );
};

export const deleteCategory = async (categoryId) => {
    return await axios.delete(
        `http://localhost:8080/api/v1.0/admin/categories/${categoryId}`,
        getAuthConfig()
    );
};

export const fetchCategories = async () => {
    return await axios.get(
        "http://localhost:8080/api/v1.0/categories",
        getAuthConfig()
    );
};
