package in.bouziani.billingsoftwar.controller;

import in.bouziani.billingsoftwar.entity.OrderEntity;
import in.bouziani.billingsoftwar.io.OrderRequest;
import in.bouziani.billingsoftwar.io.OrderResponse;
import in.bouziani.billingsoftwar.service.OrderService;
import in.bouziani.billingsoftwar.service.ReportService;
import in.bouziani.billingsoftwar.service.impl.ReportServiceImpl;
import in.bouziani.billingsoftwar.service.impl.StripeServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
public class PaymentController {

    // 🚨 Notice we removed StripeServiceImpl! The Controller doesn't need to know about Stripe anymore.
    private final OrderService orderService;
    private final StripeServiceImpl stripeService;
    private final ReportServiceImpl reportService;

    // We consolidated everything into ONE powerful endpoint
    @PostMapping("/create")
    public ResponseEntity<OrderResponse> createOrderAndPayment(@RequestBody OrderRequest orderRequest) {

        // This single line calls your awesome Service code to:
        // 1. Save the order to MySQL
        // 2. Talk to Stripe and get the cs_test_ ID
        // 3. Save the cs_test_ ID to the database
        // 4. Return the full order ticket WITH the checkout URL!
        OrderResponse response = orderService.createOrder(orderRequest);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Add this to PaymentController.java
    @PostMapping("/verify")
    public ResponseEntity<OrderResponse> verifyPayment(@RequestParam String sessionId) {
        try {
            // 1. Securely fetch the session directly from Stripe
            com.stripe.model.checkout.Session session = stripeService.verifyStripeSession(sessionId);

            // 2. Check if Stripe actually collected the money
            if ("paid".equals(session.getPaymentStatus())) {

                // 3. The payment is real! Update MySQL to COMPLETED
                OrderResponse updatedOrder = orderService.updatePaymentStatus(
                        sessionId,
                        session.getPaymentIntent(), // This is the final receipt ID!
                        "COMPLETED"
                );
                return ResponseEntity.ok(updatedOrder);
            } else {
                // They didn't pay (maybe they closed the window early)
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/receipt/{orderId}")
    public void downloadReceipt(@PathVariable String orderId, HttpServletResponse response) throws IOException {
        // 1. Set the response headers so the browser knows it's a PDF file
        response.setContentType("application/pdf");
        String headerValue = "attachment; filename=receipt_" + orderId + ".pdf";
        response.setHeader("Content-Disposition", headerValue);

        // 2. Just call the service. No repository logic here!
        reportService.exportOrderToPdf(orderId, response);
    }
}