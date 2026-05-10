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

    const getInitials = (name) => {
        if (!name) return "?";
        return name.charAt(0).toUpperCase();
    };

    // Calculate mock total products and customers since backend might not provide it directly in response.data
    // Or assume it's 0 if not provided
    const totalProducts = data.totalProducts || 0;
    const totalCustomers = data.totalCustomers || 0;

    if (loading) {
        return (
            <div className="dashboard-container page-container d-flex justify-content-center align-items-center">
                <div className="spinner-border text-light" role="status"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container page-container">
            <header className="dashboard-header">
                <h2>Overview</h2>
                <p className="text-secondary">Welcome back! Here is what's happening today.</p>
            </header>

            {/* --- STAT CARDS --- */}
            <div className="row g-4 mb-5">
                {/* Sales Card */}
                <div className="col-12 col-md-6">
                    <div className="glass-card stat-card-custom border-glow-purple">
                        <div className="stat-card-left">
                            <div className="stat-card-label">Today's Sales</div>
                            <div className="stat-card-value">${data.todaySales.toFixed(2)}</div>
                        </div>
                        <i className="bi bi-currency-dollar stat-card-icon" style={{color: 'var(--accent-primary)'}}></i>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="col-12 col-md-6">
                    <div className="glass-card stat-card-custom border-glow-cyan">
                        <div className="stat-card-left">
                            <div className="stat-card-label">Today's Orders</div>
                            <div className="stat-card-value">{data.todayOrderCount}</div>
                        </div>
                        <i className="bi bi-box-seam stat-card-icon" style={{color: 'var(--accent-secondary)'}}></i>
                    </div>
                </div>

                {/* Mini Stat Cards */}
                <div className="col-6 col-md-6">
                    <div className="glass-card p-3">
                        <div className="stat-card-label">Total Products</div>
                        <h4 className="m-0 fw-bold">{totalProducts}</h4>
                    </div>
                </div>
                <div className="col-6 col-md-6">
                    <div className="glass-card p-3">
                        <div className="stat-card-label">Total Customers</div>
                        <h4 className="m-0 fw-bold">{totalCustomers}</h4>
                    </div>
                </div>
            </div>

            {/* --- RECENT ORDERS TABLE --- */}
            <div className="glass-card table-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="m-0 fw-bold">Recent Orders</h5>
                    <Link to="/orders" className="btn-ghost text-decoration-none">
                        View All
                    </Link>
                </div>

                <div className="table-responsive-custom">
                    {data.recentOrders.length === 0 ? (
                        <div className="text-center py-4 text-secondary">
                            No recent orders found.
                        </div>
                    ) : (
                        <table className="table-custom">
                            <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.recentOrders.map((order) => {
                                const isCompleted = order.paymentDetails?.status === 'COMPLETED';
                                return (
                                    <tr key={order.orderId}>
                                        <td className="order-id-mono">
                                            #{order.orderId.replace('ORD', '')}
                                        </td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>
                                            <div className="customer-cell">
                                                <div className="customer-avatar">
                                                    {getInitials(order.customerName)}
                                                </div>
                                                <div>
                                                    <div className="fw-bold">{order.customerName}</div>
                                                    <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                                                        {order.phoneNumber}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-success-custom">
                                            ${order.grandTotal.toFixed(2)}
                                        </td>
                                        <td>
                                            {isCompleted ? (
                                                <span className="badge-status badge-completed">Completed</span>
                                            ) : (
                                                <span className="badge-status badge-pending">Pending</span>
                                            )}
                                        </td>
                                        <td>
                                            <button className="icon-btn" title="View Receipt">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;