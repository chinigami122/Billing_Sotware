import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboardData } from "../../service/DashboardService";
import toast from "react-hot-toast";
import "./Dashboard.css";

const Dashboard = () => {
    const [data, setData] = useState({
        todaySales: 0.0,
        todayOrderCount: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await fetchDashboardData();
                setData(response.data);
            } catch (error) {
                console.error("Error loading dashboard:", error);
                toast.error("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const formatDate = (dateString) => {
        const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    if (loading) {
        return (
            <div className="dashboard-container d-flex justify-content-center align-items-center">
                <div className="spinner-border text-light" role="status"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="mb-4">
                <h2 className="text-white m-0 fw-bold">Overview</h2>
                <p className="text-secondary">Welcome back! Here is what's happening today.</p>
            </header>

            {/* --- STAT CARDS --- */}
            <div className="row g-4 mb-5">
                {/* Sales Card */}
                <div className="col-12 col-md-6">
                    <div className="stat-card p-4 d-flex align-items-center">
                        <div className="stat-icon-wrapper bg-success bg-opacity-10 text-success me-4">
                            <i className="bi bi-currency-dollar fs-1"></i>
                        </div>
                        <div>
                            <h5 className="text-secondary mb-1">Today's Sales</h5>
                            <h2 className="text-white m-0 fw-bold">
                                ${data.todaySales.toFixed(2)}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="col-12 col-md-6">
                    <div className="stat-card p-4 d-flex align-items-center">
                        <div className="stat-icon-wrapper bg-info bg-opacity-10 text-info me-4">
                            <i className="bi bi-box-seam fs-1"></i>
                        </div>
                        <div>
                            <h5 className="text-secondary mb-1">Today's Orders</h5>
                            <h2 className="text-white m-0 fw-bold">
                                {data.todayOrderCount}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RECENT ORDERS TABLE --- */}
            <div className="d-flex justify-content-between align-items-end mb-3">
                <h4 className="text-white m-0">Recent Orders</h4>
                <Link to="/orders" className="btn btn-sm btn-outline-secondary">
                    View All
                </Link>
            </div>

            <div className="table-responsive bg-dark rounded shadow-sm p-3 border border-secondary border-opacity-25">
                {data.recentOrders.length === 0 ? (
                    <div className="text-center py-4 text-secondary">
                        No recent orders found.
                    </div>
                ) : (
                    <table className="table table-dark table-hover align-middle mb-0">
                        <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.recentOrders.map((order) => (
                            <tr key={order.orderId}>
                                <td className="text-secondary fw-bold">
                                    #{order.orderId.replace('ORD', '')}
                                </td>
                                <td>{formatDate(order.createdAt)}</td>
                                <td>
                                    <div>{order.customerName}</div>
                                    <small className="text-secondary">{order.phoneNumber}</small>
                                </td>
                                <td className="fw-bold text-success">
                                    ${order.grandTotal.toFixed(2)}
                                </td>
                                <td>
                                    {order.paymentDetails?.status === 'COMPLETED' ? (
                                        <span className="badge bg-success">Completed</span>
                                    ) : (
                                        <span className="badge bg-warning text-dark">Pending</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;