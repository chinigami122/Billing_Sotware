import { useEffect, useState } from "react";
import "./ActivityLog.css";
import axios from "axios";
import toast from "react-hot-toast";

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivityLogs = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("You are not logged in.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://localhost:8080/api/v1.0/activity-logs", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                setLogs(response.data || []);
            } catch (error) {
                console.error("Failed to fetch activity logs:", error);
                toast.error("Failed to load activity logs");
            } finally {
                setLoading(false);
            }
        };

        fetchActivityLogs();
    }, []);

    const getActionIcon = (action) => {
        const iconMap = {
            "CATEGORY_CREATED": { icon: "bi-tags", type: "success" },
            "CATEGORY_DELETED": { icon: "bi-trash", type: "danger" },
            "ITEM_CREATED": { icon: "bi-box-seam", type: "success" },
            "ITEM_UPDATED": { icon: "bi-pencil", type: "info" },
            "ITEM_DELETED": { icon: "bi-trash", type: "danger" },
            "ORDER_CREATED": { icon: "bi-receipt", type: "warning" },
            "USER_LOGIN": { icon: "bi-box-arrow-in-right", type: "info" },
            "USER_LOGOUT": { icon: "bi-box-arrow-right", type: "info" }
        };
        return iconMap[action] || { icon: "bi-clock-history", type: "info" };
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    if (loading) {
        return (
            <div className="activity-log-container d-flex justify-content-center align-items-center">
                <div className="spinner-border text-light" role="status"></div>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="activity-log-container">
                <header className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-white m-0 fw-bold">Activity Log</h2>
                    <span className="text-secondary">Recent admin actions</span>
                </header>
                <div className="text-center py-5 text-light">
                    <i className="bi bi-inbox fs-1 mb-3 d-block text-secondary"></i>
                    <h4>No activity logged yet</h4>
                    <p className="text-secondary">Admin actions will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="activity-log-container">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-white m-0 fw-bold">Activity Log</h2>
                <span className="text-secondary">Recent admin actions</span>
            </header>

            <div className="activity-timeline">
                {logs.map((log) => {
                    const { icon, type } = getActionIcon(log.action);
                    return (
                        <article key={log.id} className="timeline-item">
                            <div className={`timeline-icon ${type}`}>
                                <i className={`bi ${icon}`}></i>
                            </div>

                            <div className="timeline-content">
                                <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                                    <strong className="text-light">{log.userEmail}</strong>
                                    <small className="text-secondary">{formatDate(log.timestamp)}</small>
                                </div>
                                <p className="mb-1 text-light">{log.action}</p>
                                <small className="text-secondary">{log.description}</small>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityLog;

