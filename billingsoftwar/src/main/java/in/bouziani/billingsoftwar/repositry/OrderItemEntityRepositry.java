package in.bouziani.billingsoftwar.repositry;

import in.bouziani.billingsoftwar.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemEntityRepositry extends JpaRepository<OrderItemEntity , Long> {
}
