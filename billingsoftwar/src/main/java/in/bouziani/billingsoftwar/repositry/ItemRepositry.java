package in.bouziani.billingsoftwar.repositry;

import in.bouziani.billingsoftwar.entity.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemRepositry extends JpaRepository<ItemEntity, Long> {
    Optional<ItemEntity> findByItemId(String itemId);
    Integer countByCategoryId(Long id);
}
