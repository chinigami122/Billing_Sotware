package in.bouziani.billingsoftwar.service;

import in.bouziani.billingsoftwar.io.OrderRequest;
import in.bouziani.billingsoftwar.io.OrderResponse;

import org.springframework.data.domain.Pageable; // ✅ ADD THIS
import java.time.LocalDate;
import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest orderRequest);

    void deleteOrder(String orderId);

    List<OrderResponse> getAllOrders();

    OrderResponse updatePaymentStatus(String sessionId, String paymentIntentId, String status);

    Double sumSalesByDate(LocalDate date);

    Long countOrdersByDate(LocalDate date);

    List<OrderResponse> getRecentOrders(Pageable pageable);
}
