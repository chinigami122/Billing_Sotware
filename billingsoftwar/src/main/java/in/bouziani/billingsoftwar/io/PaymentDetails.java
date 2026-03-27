package in.bouziani.billingsoftwar.io;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDetails {

    // The ID of the Stripe Checkout window (starts with "cs_test_...")
    private String stripeSessionId;

    // The actual receipt ID after they pay (starts with "pi_test_...")
    private String stripePaymentIntentId;

    private PaymentStatus status;

    public enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED
    }
}