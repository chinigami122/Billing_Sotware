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

export const addUser = async (user) => {
    return await axios.post(
        "http://localhost:8080/api/v1.0/admin/register",
        user,
        getAuthConfig()
    );
};

export const deleteUser = async (userId) => {
    return await axios.delete(
        `http://localhost:8080/api/v1.0/admin/users/${userId}`,
        getAuthConfig()
    );
};

export const fetchUsers = async () => {
    return await axios.get(
        "http://localhost:8080/api/v1.0/admin/users",
        getAuthConfig()
    );
};
