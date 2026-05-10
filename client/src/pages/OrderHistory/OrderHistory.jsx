import { useEffect, useState } from "react";
import "./OrderHistory.css";
import { latestOrders } from "../../service/OrderService.js";
import { downloadOrderReceipt } from "../../service/PaymentService.js";
import toast from "react-hot-toast";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
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
            <div className="orders-history-container d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
                <div className="spinner-border text-accent-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div className="orders-history-page page-container">
            <header className="page-header-actions mb-4">
                <h2 className="page-title m-0">Order History</h2>
                
                <div className="search-box-wrapper-inline">
                    <i className="bi bi-search search-icon-inline"></i>
                    <input
                        type="text"
                        className="search-input-inline"
                        placeholder="Search name, phone, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {orders.length === 0 ? (
                <div className="glass-card text-center py-5">
                    <i className="bi bi-inbox fs-1 mb-3 d-block opacity-25"></i>
                    <h4>No orders found</h4>
                    <p className="text-secondary">Orders will appear here once customers place them.</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="glass-card text-center py-5">
                    <i className="bi bi-search fs-1 mb-3 d-block opacity-25"></i>
                    <h4>No matches found for "{searchTerm}"</h4>
                    <button className="btn btn-link text-accent-primary mt-2" onClick={() => setSearchTerm("")}>
                        Clear Search
                    </button>
                </div>
            ) : (
                <div className="glass-card table-panel">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th className="text-center">Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.orderId}>
                                    <td className="monospace-id">
                                        #{order.orderId.replace('ORD', '')}
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        <div className="fw-600">{order.customerName}</div>
                                        <small className="text-secondary">{order.phoneNumber}</small>
                                    </td>
                                    <td className="text-truncate" style={{ maxWidth: "250px" }} title={formatItems(order.items)}>
                                        {formatItems(order.items)}
                                    </td>
                                    <td className="price-accent">
                                        ${order.grandTotal.toFixed(2)}
                                    </td>
                                    <td>
                                        <span className={`status-pill ${order.paymentDetails?.status === 'COMPLETED' ? 'success' : 'warning'}`}>
                                            {order.paymentDetails?.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        {order.paymentDetails?.status === 'COMPLETED' ? (
                                            <button
                                                onClick={() => handleDownload(order.orderId)}
                                                disabled={downloadingId === order.orderId}
                                                className="btn-action-icon primary"
                                            >
                                                {downloadingId === order.orderId ? (
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                ) : (
                                                    <i className="bi bi-download"></i>
                                                )}
                                            </button>
                                        ) : (
                                            <button className="btn-action-icon disabled" disabled title="Pending orders have no receipt">
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