package in.bouziani.billingsoftwar.service.impl;

import in.bouziani.billingsoftwar.entity.ActivityLogEntity;
import in.bouziani.billingsoftwar.io.ActivityLogResponse;
import in.bouziani.billingsoftwar.repositry.ActivityLogRepository;
import in.bouziani.billingsoftwar.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    @Override
    public List<ActivityLogResponse> getAllLogs() {
        // Fetch all logs, sorted newest first, and map them to our clean DTO
        return activityLogRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(log -> new ActivityLogResponse(
                        log.getId(),
                        log.getAction(),
                        log.getDescription(),
                        log.getUserEmail(),
                        log.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void logActivity(String action, String description, String userEmail) {
        // Build the new log entity using Lombok's builder
        ActivityLogEntity log = ActivityLogEntity.builder()
                .action(action)
                .description(description)
                .userEmail(userEmail)
                // We don't need to set createdAt; @CreationTimestamp handles it automatically!
                .build();

        // Save it to the database
        activityLogRepository.save(log);
    }
}