package in.bouziani.billingsoftwar.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import in.bouziani.billingsoftwar.entity.OrderEntity;
import in.bouziani.billingsoftwar.entity.OrderItemEntity;
import in.bouziani.billingsoftwar.repositry.OrderEntityRepositry;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl {

    private final OrderEntityRepositry orderEntityRepositry;

    public void exportOrderToPdf(String orderId, HttpServletResponse response) throws IOException {
        // 2. The Service now handles the data retrieval
        OrderEntity order = orderEntityRepositry.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // 3. Setup PDF document
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // --- PDF DRAWING LOGIC ---
        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("BILLING SOFTWARE - INVOICE", fontTitle);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph(" ")); // Spacer
        document.add(new Paragraph("Order ID: " + order.getOrderId()));
        document.add(new Paragraph("Customer: " + order.getCustomerName()));
        document.add(new Paragraph("Phone: " + order.getPhoneNumber()));
        document.add(new Paragraph("Status: COMPLETED"));
        document.add(new Paragraph(" "));

        // Create Table
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.addCell("Item Name");
        table.addCell("Quantity");
        table.addCell("Price");

        for (OrderItemEntity item : order.getItems()) {
            table.addCell(item.getName());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell("$" + item.getPrice());
        }
        document.add(table);

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Grand Total: $" + order.getGrandTotal()));
        // -------------------------

        document.close();
    }
}