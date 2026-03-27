import { useEffect, useState } from "react";
import "./OrderHistory.css";
import { latestOrders } from "../../service/OrderService.js";
import { downloadOrderReceipt } from "../../service/PaymentService.js";
import toast from "react-hot-toast";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);

    // 🚨 NEW: State for our search bar
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await latestOrders();
                setOrders(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch order history");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // 🚨 NEW: Filter the orders based on what the admin types
    const filteredOrders = orders.filter((order) => {
        const term = searchTerm.toLowerCase();
        return (
            order.customerName?.toLowerCase().includes(term) ||
            order.phoneNumber?.includes(term) ||
            order.orderId?.toLowerCase().includes(term)
        );
    });

    const formatItems = (items) => {
        if (!items || items.length === 0) return "No items";
        return items.map((item) => `${item.name} (x${item.quantity})`).join(", ");
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const handleDownload = async (orderId) => {
        try {
            setDownloadingId(orderId);
            const response = await downloadOrderReceipt(orderId);

            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);

            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', `receipt_${orderId}.pdf`);

            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove();
            window.URL.revokeObjectURL(fileURL);
        } catch (error) {
            toast.error("Failed to download receipt.");
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="orders-history-container d-flex justify-content-center align-items-center">
                <div className="spinner-border text-light" role="status"></div>
            </div>
        );
    }

    return (
        <div className="orders-history-container">
            <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">

                <h2 className="text-white m-0 fw-bold">Order History</h2>

                <span className="search-wrapper position-relative d-block">
        <i
            className="bi bi-search search-icon position-absolute text-secondary"
        ></i>
        <input
            type="text"
            className="form-control custom-search-input shadow-none border-secondary"
            placeholder="Search name, phone, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    </span>

            </header>

            {orders.length === 0 ? (
                <div className="text-center py-5 text-light">
                    <i className="bi bi-inbox fs-1 mb-3 d-block text-secondary"></i>
                    <h4>No orders found</h4>
                    <p className="text-secondary">When customers place orders, they will appear here.</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                // 🚨 NEW: What shows up if their search doesn't match anything
                <div className="text-center py-5 text-light bg-dark rounded border border-secondary border-opacity-25">
                    <i className="bi bi-search fs-1 mb-3 d-block text-secondary"></i>
                    <h4>No matches found for "{searchTerm}"</h4>
                    <button className="btn btn-outline-secondary mt-2" onClick={() => setSearchTerm("")}>
                        Clear Search
                    </button>
                </div>
            ) : (
                <div className="table-responsive bg-dark rounded shadow-sm p-3 border border-secondary border-opacity-25">
                    <table className="table table-dark table-hover align-middle mb-0">
                        <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th className="text-center">Receipt</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* 🚨 NEW: We map over filteredOrders instead of orders */}
                        {filteredOrders.map((order) => (
                            <tr key={order.orderId}>
                                <td className="text-secondary fw-bold">
                                    #{order.orderId.replace('ORD', '')}
                                </td>
                                <td>{formatDate(order.createdAt)}</td>
                                <td>
                                    <div>{order.customerName}</div>
                                    <small className="text-secondary">{order.phoneNumber}</small>
                                </td>
                                <td className="text-truncate" style={{ maxWidth: "200px" }} title={formatItems(order.items)}>
                                    {formatItems(order.items)}
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
                                <td className="text-center">
                                    {order.paymentDetails?.status === 'COMPLETED' ? (
                                        <button
                                            onClick={() => handleDownload(order.orderId)}
                                            disabled={downloadingId === order.orderId}
                                            className="btn btn-sm btn-outline-info"
                                        >
                                            {downloadingId === order.orderId ? (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            ) : (
                                                <i className="bi bi-download"></i>
                                            )}
                                        </button>
                                    ) : (
                                        <button className="btn btn-sm btn-outline-secondary" disabled title="Pending orders have no receipt">
                                            <i className="bi bi-slash-circle"></i>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default OrderHistory;