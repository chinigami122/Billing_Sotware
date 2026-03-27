package in.bouziani.billingsoftwar.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityLogResponse {
    private Long id;
    private String action;
    private String description;
    private String userEmail;
    private LocalDateTime createdAt;
}