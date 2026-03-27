package in.bouziani.billingsoftwar.service;

import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import in.bouziani.billingsoftwar.io.RazorpayOrderResponse;

public interface StripeService {

    RazorpayOrderResponse createStripeSession(Double amount, String currency) throws RazorpayException;

    Session verifyStripeSession(String sessionId) throws StripeException;
}
