package in.bouziani.billingsoftwar.controller;

import in.bouziani.billingsoftwar.io.ActivityLogResponse;
import in.bouziani.billingsoftwar.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/activity-logs")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    // React will call GET /api/v1.0/activity-logs
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<ActivityLogResponse> getLogs() {
        return activityLogService.getAllLogs();
    }
}