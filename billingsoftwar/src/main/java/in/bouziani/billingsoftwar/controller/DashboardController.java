package in.bouziani.billingsoftwar.controller;

import in.bouziani.billingsoftwar.io.DashboardResponse;
import in.bouziani.billingsoftwar.io.OrderResponse;
import in.bouziani.billingsoftwar.service.OrderService;
import in.bouziani.billingsoftwar.service.impl.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboardController {

    private final OrderServiceImpl orderService;
    @GetMapping
    public DashboardResponse getDashboardData() {
        LocalDate today = LocalDate.now();
        Double todaySales = orderService.sumSalesByDate(today);
        Long todayOrderCount = orderService.countOrdersByDate(today);
        List<OrderResponse> recentOrders = orderService.getRecentOrders(null); // You can implement pagination if needed
        return new DashboardResponse(
                todaySales != null ? todaySales : 0.0, // Handle null case
                todayOrderCount != null ? todayOrderCount : 0, // Handle null case
                recentOrders
        );
    }
}
