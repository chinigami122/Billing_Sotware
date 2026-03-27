package in.bouziani.billingsoftwar.repositry;

import in.bouziani.billingsoftwar.entity.ActivityLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLogEntity, Long> {

    // We want the newest logs at the top of the page!
    List<ActivityLogEntity> findAllByOrderByCreatedAtDesc();

}