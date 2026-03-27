import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { downloadOrderReceipt, verifyPayment } from '../../service/PaymentService';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import './Success.css';

const Success = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setCartItems, setCustomerName, setMobileNumber } = useContext(AppContext);

    const [status, setStatus] = useState('loading');
    const [orderId, setOrderId] = useState(null); // 🚨 New State to store the Order ID
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const confirmPayment = async () => {
            if (!sessionId) {
                setStatus('error');
                return;
            }

            try {
                const response = await verifyPayment(sessionId);

                if (response.status === 200) {
                    // 🚨 Store the orderId from the backend response
                    setOrderId(response.data.orderId);

                    setStatus('success');
                    toast.success("Payment Verified & Order Completed!");

                    setCartItems([]);
                    setCustomerName("");
                    setMobileNumber("");
                }
            } catch (error) {
                console.error("Verification failed:", error);
                setStatus('error');
                toast.error("Could not verify payment with server.");
            }
        };

        confirmPayment();
    }, [sessionId]);

    const handleBackToExplore = () => {
        navigate('/explore');
    };

    const handleDownload = async () => {
        if (!orderId) {
            toast.error("Order ID not found.");
            return;
        }

        try {
            toast.loading("Generating your PDF...");
            const response = await downloadOrderReceipt(orderId);

            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);

            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', `receipt_${orderId}.pdf`);

            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.remove();

            // Clean up the URL object to save memory
            window.URL.revokeObjectURL(fileURL);

            toast.dismiss();
            toast.success("Receipt downloaded!");
        } catch (error) {
            toast.dismiss();
            console.error("PDF Download Error:", error);
            toast.error("Could not generate receipt.");
        }
    };

    return (
        <div className="success-container d-flex align-items-center justify-content-center vh-100">
            <div className="card p-5 text-center shadow-lg border-0" style={{ borderRadius: '15px' }}>
                {status === 'loading' && (
                    <div>
                        <div className="spinner-border text-primary mb-3" role="status"></div>
                        <h3>Verifying your payment...</h3>
                        <p className="text-muted">Please don't refresh the page.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                        <h2 className="mt-3 fw-bold">Payment Successful!</h2>
                        <p className="text-muted">Thank you for your purchase. Your order <b>{orderId}</b> is confirmed.</p>

                        <div className="d-flex gap-3 justify-content-center mt-4">
                            <button onClick={handleBackToExplore} className="btn btn-success btn-lg">
                                Back to Explore
                            </button>

                            {/* 🚨 THE DOWNLOAD BUTTON */}
                            <button onClick={handleDownload} className="btn btn-outline-primary btn-lg">
                                <i className="bi bi-file-earmark-pdf me-2"></i> Download Receipt
                            </button>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '5rem' }}></i>
                        <h2 className="mt-3">Verification Failed</h2>
                        <p className="text-muted">We couldn't confirm your payment status.</p>
                        <button onClick={handleBackToExplore} className="btn btn-warning btn-lg mt-3">
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Success;