package in.bouziani.billingsoftwar.service;

import in.bouziani.billingsoftwar.entity.OrderEntity;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface ReportService {
    void generateReceipt(OrderEntity order, HttpServletResponse response) throws IOException;
}
