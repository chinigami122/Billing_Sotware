package in.bouziani.billingsoftwar.service.impl;

import in.bouziani.billingsoftwar.entity.OrderEntity;
import in.bouziani.billingsoftwar.entity.OrderItemEntity;
import in.bouziani.billingsoftwar.io.OrderRequest;
import in.bouziani.billingsoftwar.io.OrderResponse;
import in.bouziani.billingsoftwar.io.PaymentDetails;
import in.bouziani.billingsoftwar.io.PaymentMethod;
import in.bouziani.billingsoftwar.repositry.OrderEntityRepositry;
import in.bouziani.billingsoftwar.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable; // ✅ ADD THIS
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderEntityRepositry orderEntityRepositry;

    private final ActivityLogServiceImpl activityLogService;

    // 🚨 1. We injected your new Stripe Service!
    private final StripeServiceImpl stripeService;

    @Override
    public OrderResponse createOrder(OrderRequest orderRequest) {
        OrderEntity newOrder = convertToOrderEntity(orderRequest);

        PaymentDetails paymentDetails = new PaymentDetails();
        paymentDetails.setStatus(newOrder.getPaymentMethod() == PaymentMethod.CASH ?
                PaymentDetails.PaymentStatus.COMPLETED : PaymentDetails.PaymentStatus.PENDING);

        String checkoutUrl = null;

        // 🚨 2. Call Stripe if they are NOT paying with cash
        if (newOrder.getPaymentMethod() != PaymentMethod.CASH) {
            try {
                // Get the whole session object back from Stripe
                com.stripe.model.checkout.Session stripeSession = stripeService.createStripeSession(newOrder.getGrandTotal(), "USD");

                // Save the Session ID to your database details
                paymentDetails.setStripeSessionId(stripeSession.getId());

                // Grab the URL for React
                checkoutUrl = stripeSession.getUrl();
            } catch (Exception e) {
                throw new RuntimeException("Failed to generate Stripe payment link", e);
            }
        }

        // 🚨 3. Attach the payment details to the order before saving!
        newOrder.setPaymentDetails(paymentDetails);

        List<OrderItemEntity> orderItems = orderRequest.getCartItems().stream()
                .map(this::convertToOrderItemEntity) // (I fixed the spelling typo here for you!)
                .collect(Collectors.toList());
        newOrder.setItems(orderItems);

        newOrder = orderEntityRepositry.save(newOrder);

        // ✅ ADD THIS BLOCK to silently log the activity:
        try {
            String userEmail = getCurrentUserEmail();
            activityLogService.logActivity(
                    "ORDER_CREATED",
                    "Order #" + newOrder.getOrderId() + " placed by " + newOrder.getCustomerName() + " for $" + newOrder.getGrandTotal(),
                    userEmail
            );
        } catch (Exception e) {
            // We wrap it in a try-catch so if the logging fails, it doesn't crash the user's checkout process!
            System.err.println("Failed to log activity: " + e.getMessage());
        }

        OrderResponse response = convertToResponse(newOrder);

        // 🚨 4. Attach the checkoutUrl to the response so your Controller can return it
        response.setCheckoutUrl(checkoutUrl);

        return response;
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getName() != null && !"anonymousUser".equals(authentication.getName())) {
            return authentication.getName();
        }
        return "System";
    }

    private OrderResponse convertToResponse(OrderEntity newOrder) {
        return OrderResponse.builder()
                .orderId(newOrder.getOrderId())
                .customerName(newOrder.getCustomerName())
                .phoneNumber(newOrder.getPhoneNumber())
                .items(newOrder.getItems().stream().map(this::convertToItemResponse).collect(Collectors.toList()))
                .subtotal(newOrder.getSubtotal())
                .tax(newOrder.getTax())
                .grandTotal(newOrder.getGrandTotal())
                .paymentMethod(newOrder.getPaymentMethod())
                .createdAt(newOrder.getCreatedAt())
                .paymentDetails(newOrder.getPaymentDetails())
                .build();
    }

    private OrderResponse.OrderItemResponse convertToItemResponse(OrderItemEntity orderItemEntity) {
        return OrderResponse.OrderItemResponse.builder()
                .itemId(orderItemEntity.getItemId())
                .name(orderItemEntity.getName())
                .price(orderItemEntity.getPrice())
                .quantity(orderItemEntity.getQuantity())
                .build();
    }

    // (Spelling fixed to match line 57!)
    private OrderItemEntity convertToOrderItemEntity(OrderRequest.OrderItemRequest orderItemRequest) {
        return OrderItemEntity.builder()
                .itemId(orderItemRequest.getItemId())
                .name(orderItemRequest.getName())
                .price(orderItemRequest.getPrice())
                .quantity(orderItemRequest.getQuantity())
                .build();
    }

    private OrderEntity convertToOrderEntity(OrderRequest orderRequest) {
        return OrderEntity.builder()
                .customerName(orderRequest.getCustomerName())
                .phoneNumber(orderRequest.getPhoneNumber())
                .subtotal(orderRequest.getSubtotal())
                .tax(orderRequest.getTax())
                .grandTotal(orderRequest.getGrandTotal())
                .paymentMethod(PaymentMethod.valueOf(orderRequest.getPaymentMethod()))
                .build();
    }

    @Override
    public void deleteOrder(String orderId) {
        OrderEntity order = orderEntityRepositry.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        orderEntityRepositry.delete(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderEntityRepositry.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Add this inside OrderServiceImpl.java
    @Override
    public OrderResponse updatePaymentStatus(String sessionId, String paymentIntentId, String status) {
        // Find the order that has this specific Stripe Session ID
        OrderEntity order = orderEntityRepositry.findAll().stream()
                .filter(o -> o.getPaymentDetails() != null && sessionId.equals(o.getPaymentDetails().getStripeSessionId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Order not found for Session ID: " + sessionId));

        // Update the database fields
        order.getPaymentDetails().setStatus(PaymentDetails.PaymentStatus.valueOf(status));
        order.getPaymentDetails().setStripePaymentIntentId(paymentIntentId);

        // Save the updated order back to MySQL
        order = orderEntityRepositry.save(order);

        return convertToResponse(order);
    }

    @Override
    public Double sumSalesByDate(LocalDate date) {
        return orderEntityRepositry.sumSalesByDate(date);
    }

    @Override
    public Long countOrdersByDate(LocalDate date) {
        return orderEntityRepositry.countByOrderDate(date);
    }

    @Override
    public List<OrderResponse> getRecentOrders(Pageable pageable) {
        return orderEntityRepositry.findRecentOrders((Pageable) PageRequest.of(0 , 5)).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
}