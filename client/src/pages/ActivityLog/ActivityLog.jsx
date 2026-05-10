import { useEffect, useState } from "react";
import "./ActivityLog.css";
import toast from "react-hot-toast";
import { fetchActivityLogs } from "../../service/ActivityLogService.js";

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const response = await fetchActivityLogs();
                setLogs(response.data || []);
            } catch (error) {
                console.error("Failed to fetch activity logs:", error);
                toast.error("Failed to load activity logs");
            } finally {
                setLoading(false);
            }
        };

        loadLogs();
    }, []);

    const getActionIcon = (action) => {
        const iconMap = {
            "CATEGORY_CREATED": { icon: "bi-tags", type: "success" },
            "CATEGORY_DELETED": { icon: "bi-trash", type: "danger" },
            "ITEM_CREATED": { icon: "bi-box-seam", type: "success" },
            "ITEM_UPDATED": { icon: "bi-pencil", type: "info" },
            "ITEM_DELETED": { icon: "bi-trash", type: "danger" },
            "ORDER_CREATED": { icon: "bi-receipt", type: "warning" },
            "USER_LOGIN": { icon: "bi-box-arrow-in-right", type: "primary" },
            "USER_LOGOUT": { icon: "bi-box-arrow-right", type: "secondary" }
        };
        return iconMap[action] || { icon: "bi-clock-history", type: "info" };
    };

    const formatDate = (dateString) => {
        const options = {
            month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit"
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    if (loading) {
        return (
            <div className="page-container d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
                <div className="spinner-border text-accent-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div className="activity-page page-container">
            <header className="mb-4">
                <h2 className="page-title m-0">Activity Log</h2>
                <p className="text-secondary mt-1">Real-time audit trail of system actions</p>
            </header>

            {logs.length === 0 ? (
                <div className="glass-card text-center py-5">
                    <i className="bi bi-inbox fs-1 mb-3 d-block opacity-25"></i>
                    <h4>No activity logged yet</h4>
                    <p className="text-secondary">Admin actions will appear here.</p>
                </div>
            ) : (
                <div className="timeline-modern">
                    {logs.map((log) => {
                        const { icon, type } = getActionIcon(log.action);
                        return (
                            <div key={log.id} className="timeline-card-wrapper">
                                <div className={`timeline-dot-connector ${type}`}>
                                    <div className="dot"></div>
                                    <div className="line"></div>
                                </div>
                                <div className="glass-card timeline-card">
                                    <div className="card-top">
                                        <div className={`action-badge ${type}`}>
                                            <i className={`bi ${icon}`}></i>
                                            <span>{log.action.replace('_', ' ')}</span>
                                        </div>
                                        <span className="timestamp">{formatDate(log.timestamp)}</span>
                                    </div>
                                    <div className="card-body-log">
                                        <p className="description">{log.description}</p>
                                        <div className="user-info-log">
                                            <i className="bi bi-person-fill"></i>
                                            <span>{log.userEmail}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ActivityLog;
