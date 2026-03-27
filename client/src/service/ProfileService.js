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

export const updateProfile = async (profileData) => {
    return await axios.put(
        "http://localhost:8080/api/v1.0/profile",
        profileData,
        getAuthConfig()
    );
};

export const fetchProfile = async () => {
    return await axios.get(
        "http://localhost:8080/api/v1.0/profile",
        getAuthConfig()
    );
};

