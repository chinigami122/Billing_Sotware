import axios from "axios";

// Make sure this matches your actual backend URL
const API_BASE_URL = "http://localhost:8080/api/v1.0";

export const fetchDashboardData = async () => {
    // Grab the JWT token we saved during login
    const token = localStorage.getItem("token");

    // Make the GET request and attach the token in the headers
    return await axios.get(`${API_BASE_URL}/dashboard`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};