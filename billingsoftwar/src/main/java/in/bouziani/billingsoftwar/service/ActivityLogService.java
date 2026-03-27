package in.bouziani.billingsoftwar.service;

import in.bouziani.billingsoftwar.io.ActivityLogResponse;

import java.util.List;

public interface ActivityLogService {
    // Used by React to display the timeline
    List<ActivityLogResponse> getAllLogs();

    // Used internally by Spring Boot to save a new log
    void logActivity(String action, String description, String userEmail);
}