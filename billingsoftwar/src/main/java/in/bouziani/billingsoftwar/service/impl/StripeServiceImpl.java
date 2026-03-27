package in.bouziani.billingsoftwar.service.impl;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeServiceImpl {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public Session createStripeSession(Double amount, String currency) throws StripeException {

        long amountInCents = (long) Math.round(amount * 100);

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                // 🚨 FIX 1: Add the session_id template.
                // Stripe will automatically replace {CHECKOUT_SESSION_ID} with the real ID!
                .setSuccessUrl("http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:5173/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(currency.toLowerCase())
                                                .setUnitAmount(amountInCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Billing Software Order")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        // 🚨 FIX 2: Create the session ONLY ONCE and return that specific object
        return Session.create(params);
    }

    public Session verifyStripeSession(String sessionId) throws StripeException {
        return Session.retrieve(sessionId);
    }
}