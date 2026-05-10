import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1.0";

export const fetchActivityLogs = async () => {
    const token = localStorage.getItem("token");
    return await axios.get(`${API_BASE_URL}/activity-logs`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
