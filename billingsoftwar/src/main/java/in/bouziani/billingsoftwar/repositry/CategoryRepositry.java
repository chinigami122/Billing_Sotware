package in.bouziani.billingsoftwar.repositry;

import in.bouziani.billingsoftwar.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepositry extends JpaRepository<CategoryEntity,Long> {
    Optional<CategoryEntity> findByCategoryId(String categoryId);
}
